import { Node, NodeType, Ast } from '#markdoc';
import { ReadonlyPropPath } from '../DocumentEditor/component-blocks/utils';
import { getValueAtPropPath } from '../../../props-value';
import { areArraysEqual } from '../DocumentEditor/document-features-normalization';
import { Mark } from '../DocumentEditor/utils';
import { ComponentBlock } from '../../../..';
import {
  findSingleChildField,
  PathToChildFieldWithOption,
} from './find-children';
import { DocumentFeatures } from '../DocumentEditor/document-features';
import { getInitialPropsValueFromInitializer } from '../../../initial-values';
import type { Descendant } from 'slate';
import { fixPath } from '../../../../app/path-utils';
import { getSrcPrefixForImageBlock } from '../DocumentEditor/component-blocks/document-field';
import { serializeProps } from '../../../serialize-props';

function toInline(nodes: Descendant[]): Node {
  return new Ast.Node('inline', {}, nodes.flatMap(toMarkdocInline));
}

const markToMarkdoc: Record<Mark, { type: NodeType; tag?: string }> = {
  bold: { type: 'strong' },
  code: { type: 'code' },
  italic: { type: 'em' },
  underline: { type: 'tag', tag: 'u' },
  keyboard: { type: 'tag', tag: 'kbd' },
  strikethrough: { type: 's' },
  subscript: { type: 'tag', tag: 'sub' },
  superscript: { type: 'tag', tag: 'sup' },
};

function toMarkdocInline(node: Descendant): Node | Node[] {
  if (node.type === 'link') {
    return new Ast.Node(
      'link',
      { href: node.href },
      node.children.flatMap(toMarkdocInline)
    );
  }
  if (node.type !== undefined) {
    throw new Error(`unexpected inline node type: ${node.type}`);
  }
  const marks = (
    Object.keys(node).filter(
      mark => mark !== 'text' && mark !== 'code'
    ) as Mark[]
  ).sort();
  const splitByNewLines = node.text.split(/\n/);
  if (splitByNewLines.length > 1) {
    return splitByNewLines.flatMap((x, i) => {
      if (i === 0) {
        return toMarkdocInline({
          ...node,
          text: x,
        });
      }
      const inner = toMarkdocInline({
        ...node,
        text: x,
      });
      return [
        new Ast.Node('hardbreak'),
        ...(Array.isArray(inner) ? inner : [inner]),
      ];
    });
  }
  const leadingWhitespace = /^\s+/.exec(node.text)?.[0];
  const trailingWhitespace = /\s+$/.exec(node.text)?.[0];

  let children = node.code
    ? [new Ast.Node('code', { content: node.text.trim() }, [])]
    : [new Ast.Node('text', { content: node.text.trim() })];
  for (const mark of marks) {
    const config = markToMarkdoc[mark];
    if (config) {
      children = [new Ast.Node(config.type, {}, children, config.tag)];
    }
  }

  if (/^\s+$/.test(node.text)) {
    children.unshift(new Ast.Node('text', { content: leadingWhitespace }, []));
  } else {
    if (leadingWhitespace?.length) {
      children.unshift(
        new Ast.Node('text', { content: leadingWhitespace }, [])
      );
    }
    if (trailingWhitespace?.length) {
      children.push(new Ast.Node('text', { content: trailingWhitespace }, []));
    }
  }

  return children;
}

export function toMarkdocDocument(
  nodes: Descendant[],
  _config: {
    componentBlocks: Record<string, ComponentBlock>;
    documentFeatures: DocumentFeatures;
    slug: string | undefined;
  }
) {
  const extraFiles: {
    contents: Uint8Array;
    path: string;
    parent: string | undefined;
  }[] = [];
  const config = {
    ..._config,
    extraFiles,
  };
  const node = new Ast.Node(
    'document',
    {},
    nodes.flatMap(x => toMarkdoc(x, config))
  );
  return {
    node,
    extraFiles,
  };
}

function toChildrenAndProps(
  childrenAsMarkdoc: {
    propPath: ReadonlyPropPath;
    children: Node[];
  }[],
  resultingChildren: Node[],
  value: unknown,
  singleChildField: PathToChildFieldWithOption
) {
  if (singleChildField.kind === 'child') {
    const child = childrenAsMarkdoc.find(x =>
      areArraysEqual(x.propPath, singleChildField.relativePath)
    );
    if (child) {
      resultingChildren.push(...child.children);
    }
    return;
  }
  if (singleChildField.kind === 'array') {
    const key =
      singleChildField.relativePath[singleChildField.relativePath.length - 1];
    const parent = getValueAtPropPath(
      value,
      singleChildField.relativePath.slice(0, -1)
    );
    const valueAtPropPath = (parent as any)[key] as unknown[];
    delete (parent as any)[key];
    const childNodes = new Map<
      number,
      { children: Node[]; propPath: ReadonlyPropPath }[]
    >();
    for (const child of childrenAsMarkdoc) {
      const innerPropPath = child.propPath.slice(
        singleChildField.relativePath.length + 1
      );
      const num = child.propPath[
        singleChildField.relativePath.length
      ] as number;
      if (childNodes.get(num) === undefined) {
        childNodes.set(num, []);
      }
      childNodes
        .get(num)!
        .push({ children: child.children, propPath: innerPropPath });
    }

    resultingChildren.push(
      ...valueAtPropPath.map((x, i) => {
        const newChildrenAsMarkdoc = childNodes.get(i) ?? [];
        const children: Node[] = [];

        toChildrenAndProps(
          newChildrenAsMarkdoc,
          children,
          x,
          singleChildField.child
        );
        return new Ast.Node(
          'tag',
          x as any,
          children,
          singleChildField.asChildTag
        );
      })
    );
  }
}

function toMarkdoc(
  node: Descendant,
  config: {
    componentBlocks: Record<string, ComponentBlock>;
    documentFeatures: DocumentFeatures;
    slug: string | undefined;
    extraFiles: {
      contents: Uint8Array;
      path: string;
      parent: string | undefined;
    }[];
  }
): Node {
  if (node.type === 'paragraph') {
    const markdocNode = new Ast.Node(
      'paragraph',
      node.textAlign ? { textAlign: node.textAlign } : {},
      [toInline(node.children)]
    );
    if (node.textAlign) {
      markdocNode.annotations.push({
        name: 'textAlign',
        value: node.textAlign,
        type: 'attribute',
      });
    }
    return markdocNode;
  }
  if (node.type === 'image') {
    config.extraFiles.push({
      contents: node.src.content,
      path: node.src.filename,
      parent:
        typeof config.documentFeatures.images === 'object' &&
        typeof config.documentFeatures.images.directory === 'string'
          ? fixPath(config.documentFeatures.images.directory)
          : undefined,
    });
    return new Ast.Node('paragraph', {}, [
      new Ast.Node('inline', {}, [
        new Ast.Node('image', {
          src: encodeURI(
            `${getSrcPrefixForImageBlock(
              config.documentFeatures,
              config.slug
            )}${node.src.filename}`
          ),
          alt: node.alt,
          title: node.title,
        }),
      ]),
    ]);
  }
  if (node.type === 'code') {
    const extraAttributes: Record<string, unknown> = {};
    const { children, language, type, ...rest } = node;
    const schema =
      typeof config.documentFeatures.formatting.blockTypes.code === 'object'
        ? config.documentFeatures.formatting.blockTypes.code.schema
        : undefined;
    if (schema && Object.keys(schema.fields).length > 0) {
      const serialized = serializeProps(
        getInitialPropsValueFromInitializer(schema, rest),
        schema,
        undefined,
        config.slug,
        false
      );
      Object.assign(extraAttributes, serialized.value);
      config.extraFiles.push(...serialized.extraFiles);
    }

    let content = (children[0] as { text: string }).text + '\n';

    const markdocNode = new Ast.Node(
      'fence',
      { content, language, ...extraAttributes },
      [new Ast.Node('text', { content })]
    );

    for (const [key, value] of Object.entries(extraAttributes)) {
      markdocNode.annotations.push({
        name: key,
        value,
        type: 'attribute',
      });
    }

    return markdocNode;
  }
  const _toMarkdoc = (node: Descendant) => toMarkdoc(node, config);
  if (node.type === 'blockquote') {
    return new Ast.Node('blockquote', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'divider') {
    return new Ast.Node('hr');
  }
  if (node.type === 'table') {
    const head = node.children.find(
      (x): x is typeof x & { type: 'table-head' } => x.type === 'table-head'
    );
    return new Ast.Node(
      'tag',
      {},
      [
        new Ast.Node('table', {}, [
          new Ast.Node('thead', {}, head ? head.children.map(_toMarkdoc) : []),
          _toMarkdoc(node.children.find(x => x.type === 'table-body')!),
        ]),
      ],
      'table'
    );
  }
  if (node.type === 'table-body') {
    return new Ast.Node('tbody', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'table-row') {
    return new Ast.Node('tr', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'table-cell') {
    return new Ast.Node(
      node.header ? 'th' : 'td',
      {},
      node.children.map(_toMarkdoc)
    );
  }
  if (node.type === 'heading') {
    const extraAttributes: Record<string, unknown> = {};
    if (node.textAlign) {
      extraAttributes.textAlign = node.textAlign;
    }
    const { children, level, textAlign, type, ...rest } = node;
    const schema = config.documentFeatures.formatting.headings.schema;
    if (Object.keys(schema.fields).length > 0) {
      Object.assign(
        extraAttributes,
        serializeProps(
          getInitialPropsValueFromInitializer(schema, rest),
          schema,
          undefined,
          config.slug,
          false
        ).value
      );
    }
    const markdocNode = new Ast.Node(
      'heading',
      { level: node.level, ...extraAttributes },
      [toInline(node.children)]
    );
    for (const [key, value] of Object.entries(extraAttributes)) {
      markdocNode.annotations.push({
        name: key,
        value,
        type: 'attribute',
      });
    }

    return markdocNode;
  }
  if (node.type === 'ordered-list') {
    return new Ast.Node(
      'list',
      { ordered: true },
      node.children.map(_toMarkdoc)
    );
  }
  if (node.type === 'unordered-list') {
    return new Ast.Node(
      'list',
      { ordered: false },
      node.children.map(_toMarkdoc)
    );
  }
  if (node.type === 'layout') {
    return new Ast.Node(
      'tag',
      { layout: node.layout },
      node.children.map(_toMarkdoc),
      'layout'
    );
  }
  if (node.type === 'layout-area') {
    return new Ast.Node(
      'tag',
      {},
      node.children.flatMap(_toMarkdoc),
      'layout-area'
    );
  }
  if (node.type === 'component-block') {
    const isVoid =
      node.children.length === 1 &&
      node.children[0].type === 'component-inline-prop' &&
      node.children[0].propPath === undefined;
    const componentBlock = config.componentBlocks[node.component] as
      | ComponentBlock
      | undefined;

    const childrenAsMarkdoc: {
      type: 'component-block-prop' | 'component-inline-prop';
      propPath: ReadonlyPropPath;
      children: Node[];
    }[] = [];

    for (const child of node.children) {
      if (
        (child.type === 'component-block-prop' ||
          child.type === 'component-inline-prop') &&
        child.propPath !== undefined
      ) {
        childrenAsMarkdoc.push({
          type: child.type,
          propPath: child.propPath,
          children:
            child.type === 'component-block-prop'
              ? child.children.flatMap(_toMarkdoc)
              : [toInline(child.children)],
        });
      }
    }

    let attributes = node.props;

    if (componentBlock) {
      const serialized = serializeProps(
        node.props,
        { kind: 'object' as const, fields: componentBlock.schema },
        undefined,
        config.slug,
        false
      );
      attributes = serialized.value as Record<string, unknown>;
      config.extraFiles.push(...serialized.extraFiles);
      const singleChildField = findSingleChildField({
        kind: 'object',
        fields: componentBlock.schema,
      });
      if (singleChildField) {
        const children: Node[] = [];
        toChildrenAndProps(
          childrenAsMarkdoc,
          children,
          attributes,
          singleChildField
        );
        return new Ast.Node('tag', attributes, children, node.component);
      }
    }
    const children = isVoid
      ? []
      : childrenAsMarkdoc.map(
          x => new Ast.Node('tag', { propPath: x.propPath }, x.children, x.type)
        );
    return new Ast.Node('tag', attributes, children, node.component);
  }
  if (
    node.type === 'component-block-prop' ||
    node.type === 'component-inline-prop'
  ) {
    return new Ast.Node(
      'tag',
      { propPath: node.propPath },
      node.type === 'component-inline-prop'
        ? [toInline(node.children)]
        : node.children.flatMap(_toMarkdoc),
      node.type
    );
  }
  if (node.type === 'list-item') {
    const listItemContent = node.children[0];
    if (listItemContent.type !== 'list-item-content') {
      throw new Error('list item content must contain a list-item-content');
    }
    const inline = toInline(listItemContent.children);
    const children = [inline];
    const nestedList = node.children[1];
    if (nestedList) {
      children.push(toMarkdoc(nestedList, config));
    }
    return new Ast.Node('item', {}, children);
  }
  if (node.type === 'list-item-content') {
    throw new Error('list-item-content in unexpected position');
  }
  debugger;
  throw new Error(`unexpected node type: ${node.type}`);
}
