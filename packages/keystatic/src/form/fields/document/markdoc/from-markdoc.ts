import { Node } from '#markdoc';
import type { Descendant } from 'slate';
import { ReadonlyPropPath } from '../DocumentEditor/component-blocks/utils';
import { getValueAtPropPath } from '../../../props-value';
import {
  getInlineNodes,
  addMarkToChildren,
  setLinkForChildren,
} from '../DocumentEditor/pasting/utils';
import { ComponentBlock } from '../../../..';
import {
  findSingleChildField,
  PathToChildFieldWithOption,
} from './find-children';

function inlineNodeFromMarkdoc(node: Node): Descendant | Descendant[] {
  if (node.type === 'inline') {
    return inlineChildrenFromMarkdoc(node.children);
  }
  if (node.type === 'link') {
    return setLinkForChildren(node.attributes.href, () =>
      inlineChildrenFromMarkdoc(node.children)
    );
  }
  if (node.type === 'text') {
    return getInlineNodes(node.attributes.content);
  }
  if (node.type === 'strong') {
    return addMarkToChildren('bold', () =>
      inlineChildrenFromMarkdoc(node.children)
    );
  }
  if (node.type === 'code') {
    return addMarkToChildren('code', () =>
      getInlineNodes(node.attributes.content)
    );
  }
  if (node.type === 'em') {
    return addMarkToChildren('italic', () =>
      inlineChildrenFromMarkdoc(node.children)
    );
  }
  if (node.type === 's') {
    return addMarkToChildren('strikethrough', () =>
      inlineChildrenFromMarkdoc(node.children)
    );
  }

  if (node.type === 'tag') {
    if (node.tag === 'u') {
      return addMarkToChildren('underline', () =>
        inlineChildrenFromMarkdoc(node.children)
      );
    }
    if (node.tag === 'kbd') {
      return addMarkToChildren('keyboard', () =>
        inlineChildrenFromMarkdoc(node.children)
      );
    }
    if (node.tag === 'sub') {
      return addMarkToChildren('subscript', () =>
        inlineChildrenFromMarkdoc(node.children)
      );
    }
    if (node.tag === 'sup') {
      return addMarkToChildren('superscript', () =>
        inlineChildrenFromMarkdoc(node.children)
      );
    }
  }
  if (node.type === 'softbreak') {
    return getInlineNodes(' ');
  }
  if (node.type === 'hardbreak') {
    return getInlineNodes('\n');
  }
  if (
    node.tag === 'component-inline-prop' &&
    Array.isArray(node.attributes.propPath) &&
    node.attributes.propPath.every(
      x => typeof x === 'string' || typeof x === 'number'
    )
  ) {
    return {
      type: 'component-inline-prop',
      children: inlineFromMarkdoc(node.children),
      propPath: node.attributes.propPath,
    };
  }

  throw new Error(`Unknown inline node type: ${node.type}`);
}

function inlineChildrenFromMarkdoc(nodes: Node[]): Descendant[] {
  return nodes.flatMap(inlineNodeFromMarkdoc);
}

function inlineFromMarkdoc(nodes: Node[]): Descendant[] {
  const transformedNodes = nodes.flatMap(inlineNodeFromMarkdoc);
  const nextNodes = [];
  let lastNode: Descendant | undefined;
  for (const [idx, node] of transformedNodes.entries()) {
    if (
      node.type === undefined &&
      node.text === '' &&
      lastNode?.type === undefined &&
      idx !== transformedNodes.length - 1
    ) {
      continue;
    }
    nextNodes.push(node);
    lastNode = node;
  }
  if (!nextNodes.length) {
    nextNodes.push({ text: '' });
  }
  return nextNodes;
}

export function fromMarkdoc(
  node: Node,
  componentBlocks: Record<string, ComponentBlock>
): Descendant[] {
  const nodes = node.children.flatMap(x => fromMarkdocNode(x, componentBlocks));
  if (nodes.length === 0) {
    return [{ type: 'paragraph', children: [{ text: '' }] }];
  }
  if (nodes[nodes.length - 1].type !== 'paragraph') {
    nodes.push({ type: 'paragraph', children: [{ text: '' }] });
  }
  return nodes;
}

function fromMarkdocNode(
  node: Node,
  componentBlocks: Record<string, ComponentBlock>
): Descendant[] | Descendant {
  if (node.type === 'blockquote') {
    return {
      type: 'blockquote',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
    };
  }
  if (node.type === 'fence') {
    const { language, content, ...rest } = node.attributes;
    return {
      type: 'code',
      children: [{ text: content.replace(/\n$/, '') }],
      ...(typeof language === 'string' ? { language } : {}),
      ...rest,
    };
  }
  if (node.type === 'heading') {
    return {
      ...node.attributes,
      level: node.attributes.level,
      type: 'heading',
      children: inlineFromMarkdoc(node.children),
    };
  }
  if (node.type === 'list') {
    return {
      type: node.attributes.ordered ? 'ordered-list' : 'unordered-list',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
    };
  }
  if (node.type === 'item') {
    const children: Descendant[] = [
      {
        type: 'list-item-content',
        children: node.children.length
          ? inlineFromMarkdoc([node.children[0]])
          : [{ text: '' }],
      },
    ];
    if (node.children[1]?.type === 'list') {
      const list = node.children[1];
      children.push({
        type: list.attributes.ordered ? 'ordered-list' : 'unordered-list',
        children: list.children.flatMap(x =>
          fromMarkdocNode(x, componentBlocks)
        ),
      });
    }
    return { type: 'list-item', children };
  }
  if (node.type === 'paragraph') {
    if (
      node.children.length === 1 &&
      node.children[0].type === 'inline' &&
      node.children[0].children.length === 1 &&
      node.children[0].children[0].type === 'image'
    ) {
      const image = node.children[0].children[0];
      return {
        type: 'image',
        src: decodeURI(image.attributes.src) as any,
        alt: image.attributes.alt,
        title: image.attributes.title ?? '',
        children: [{ text: '' }],
      };
    }
    const children = inlineFromMarkdoc(node.children);
    if (children.length === 1 && children[0].type === 'component-inline-prop') {
      return children[0];
    }
    return {
      type: 'paragraph',
      children,
      textAlign: node.attributes.textAlign,
    };
  }
  if (node.type === 'hr') {
    return { type: 'divider', children: [{ text: '' }] };
  }
  if (node.type === 'table') {
    return {
      type: 'table',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
    };
  }
  if (node.type === 'tbody') {
    return {
      type: 'table-body',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
    };
  }
  if (node.type === 'thead') {
    if (!node.children.length) return [];
    return {
      type: 'table-head',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
    };
  }
  if (node.type === 'tr') {
    return {
      type: 'table-row',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
    };
  }
  if (node.type === 'td') {
    return {
      type: 'table-cell',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
    };
  }
  if (node.type === 'th') {
    return {
      type: 'table-cell',
      header: true,
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
    };
  }
  if (node.type === 'tag') {
    if (node.tag === 'table') {
      return fromMarkdocNode(node.children[0], componentBlocks);
    }
    if (node.tag === 'layout') {
      return {
        type: 'layout',
        layout: node.attributes.layout,
        children: node.children.flatMap(x =>
          fromMarkdocNode(x, componentBlocks)
        ),
      };
    }
    if (node.tag === 'layout-area') {
      return {
        type: 'layout-area',
        children: node.children.flatMap(x =>
          fromMarkdocNode(x, componentBlocks)
        ),
      };
    }
    if (node.tag === 'component-block') {
      return {
        type: 'component-block',
        component: node.attributes.component,
        props: node.attributes.props,
        children:
          node.children.length === 0
            ? [{ type: 'component-inline-prop', children: [{ text: '' }] }]
            : node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
      };
    }
    if (
      node.tag === 'component-block-prop' &&
      Array.isArray(node.attributes.propPath) &&
      node.attributes.propPath.every(
        x => typeof x === 'string' || typeof x === 'number'
      )
    ) {
      return {
        type: 'component-block-prop',
        children: node.children.flatMap(x =>
          fromMarkdocNode(x, componentBlocks)
        ),
        propPath: node.attributes.propPath,
      };
    }
    if (node.tag) {
      const componentBlock = componentBlocks[node.tag];
      if (componentBlock) {
        const singleChildField = findSingleChildField({
          kind: 'object',
          fields: componentBlock.schema,
        });
        if (singleChildField) {
          const newAttributes = JSON.parse(JSON.stringify(node.attributes));
          const children: Descendant[] = [];
          toChildrenAndProps(
            node.children,
            children,
            newAttributes,
            singleChildField,
            [],
            componentBlocks
          );
          return {
            type: 'component-block',
            component: node.tag,
            props: newAttributes,
            children,
          };
        }
        return {
          type: 'component-block',
          component: node.tag,
          props: node.attributes,
          children:
            node.children.length === 0
              ? [{ type: 'component-inline-prop', children: [{ text: '' }] }]
              : node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
        };
      }
    }
    throw new Error(`Unknown tag: ${node.tag}`);
  }
  return inlineNodeFromMarkdoc(node);
}

function toChildrenAndProps(
  fromMarkdoc: Node[],
  resultingChildren: Descendant[],
  value: unknown,
  singleChildField: PathToChildFieldWithOption,
  parentPropPath: ReadonlyPropPath,
  componentBlocks: Record<string, ComponentBlock>
) {
  if (singleChildField.kind === 'child') {
    const children = fromMarkdoc.flatMap(x =>
      fromMarkdocNode(x, componentBlocks)
    );
    resultingChildren.push({
      type: `component-${singleChildField.options.kind}-prop`,
      propPath: [...parentPropPath, ...singleChildField.relativePath],
      children,
    });
  }
  if (singleChildField.kind === 'array') {
    const arr: unknown[] = [];
    for (let [idx, child] of fromMarkdoc.entries()) {
      if (child.type === 'paragraph') {
        child = child.children[0].children[0];
      }
      if (child.type !== 'tag') {
        throw new Error(
          `expected tag ${singleChildField.asChildTag}, found type: ${child.type}`
        );
      }
      if (child.tag !== singleChildField.asChildTag) {
        throw new Error(
          `expected tag ${singleChildField.asChildTag}, found tag: ${child.tag}`
        );
      }

      const attributes = JSON.parse(JSON.stringify(child.attributes));
      if (singleChildField.child) {
        toChildrenAndProps(
          child.children,
          resultingChildren,
          attributes,
          singleChildField.child,
          [...parentPropPath, ...singleChildField.relativePath, idx],
          componentBlocks
        );
      }
      arr.push(attributes);
    }
    const key =
      singleChildField.relativePath[singleChildField.relativePath.length - 1];
    const parent = getValueAtPropPath(
      value,
      singleChildField.relativePath.slice(0, -1)
    );
    (parent as any)[key] = arr;
  }
}
