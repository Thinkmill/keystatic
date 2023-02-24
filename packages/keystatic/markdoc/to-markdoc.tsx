import { Node, Ast, NodeType } from '@markdoc/markdoc';
import {
  getValueAtPropPath,
  ReadonlyPropPath,
} from '../DocumentEditor/component-blocks/utils';
import { areArraysEqual } from '../DocumentEditor/document-features-normalization';
import { Mark } from '../DocumentEditor/utils';
import { ComponentBlock, ComponentSchema } from '../src';
import { ElementFromValidation } from '../structure-validation';
import {
  findSingleChildField,
  PathToChildFieldWithOption,
} from './find-children';

function toInline(nodes: ElementFromValidation[]): Node {
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

function toMarkdocInline(node: ElementFromValidation): Node | Node[] {
  if (node.type === 'link') {
    return new Ast.Node(
      'link',
      { href: node.href },
      node.children.flatMap(toMarkdocInline)
    );
  }
  if (node.type === 'relationship') {
    return new Ast.Node(
      'tag',
      { relationship: node.relationship },
      [],
      'relationship'
    );
  }
  if (node.type !== undefined) {
    throw new Error(`unexpected inline node type: ${node.type}`);
  }
  if (node.code) {
    return new Ast.Node('code', { content: node.text }, []);
  }
  const marks = (
    Object.keys(node).filter(mark => mark !== 'text') as Mark[]
  ).sort();

  let markdocNode = new Ast.Node('text', { content: node.text });
  for (const mark of marks) {
    const config = markToMarkdoc[mark];
    markdocNode = new Ast.Node(config.type, {}, [markdocNode], config.tag);
  }
  return markdocNode;
}

export function toMarkdocDocument(
  nodes: ElementFromValidation[],
  componentBlocks: Record<string, ComponentBlock>
) {
  return new Ast.Node(
    'document',
    {},
    nodes.flatMap(x => toMarkdoc(x, componentBlocks))
  );
}

function removeUnnecessaryChildFieldValues(
  schema: ComponentSchema,
  parent: ComponentSchema | undefined,
  value: unknown
): unknown {
  if (schema.kind === 'form') {
    return value;
  }
  if (schema.kind === 'child') {
    if (parent?.kind === 'array') {
      return null;
    }
    return undefined;
  }
  if (schema.kind === 'array') {
    return (value as unknown[]).map(x =>
      removeUnnecessaryChildFieldValues(schema.element, schema, x)
    );
  }
  if (schema.kind === 'object') {
    return Object.fromEntries(
      Object.entries(schema.fields)
        .map(([key, innerSchema]) => [
          key,
          removeUnnecessaryChildFieldValues(
            innerSchema,
            schema,
            (value as any)[key]
          ),
        ])
        .filter(([, val]) => val !== undefined)
    );
  }
  if (schema.kind === 'conditional') {
    return {
      discriminant: (value as any).discriminant,
      value: removeUnnecessaryChildFieldValues(
        schema.values[(value as any).discriminant],
        schema,
        (value as any).value
      ),
    };
  }
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
  node: ElementFromValidation,
  componentBlocks: Record<string, ComponentBlock>
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
  if (node.type === 'code') {
    let content = (node.children[0] as { text: string }).text + '\n';
    return new Ast.Node('fence', { content, language: node.language }, [
      new Ast.Node('text', { content }),
    ]);
  }
  const _toMarkdoc = (node: ElementFromValidation) =>
    toMarkdoc(node, componentBlocks);
  if (node.type === 'blockquote') {
    return new Ast.Node('blockquote', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'divider') {
    return new Ast.Node('hr');
  }
  if (node.type === 'heading') {
    const markdocNode = new Ast.Node(
      'heading',
      {
        level: node.level,
        ...(node.textAlign ? { textAlign: node.textAlign } : {}),
      },
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
    const componentBlock = componentBlocks[node.component];
    let singleChildField;
    if (componentBlock) {
      singleChildField = findSingleChildField({
        kind: 'object',
        fields: componentBlock.schema,
      });
    }

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

    const schema = { kind: 'object' as const, fields: componentBlock.schema };

    const attributes = componentBlock
      ? (removeUnnecessaryChildFieldValues(
          schema,
          undefined,
          node.props
        ) as Record<string, unknown>)
      : node.props;

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
      children.push(toMarkdoc(nestedList, componentBlocks));
    }
    return new Ast.Node('item', {}, children);
  }
  if (node.type === 'list-item-content') {
    throw new Error('list-item-content in unexpected position');
  }
  debugger;
  throw new Error(`unexpected node type: ${node.type}`);
}
