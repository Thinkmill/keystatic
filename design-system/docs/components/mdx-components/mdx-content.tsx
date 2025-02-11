import type {
  RenderableTreeNode,
  RenderableTreeNodes,
  Scalar,
} from '@markdoc/markdoc';
import React, { ElementType, ReactNode, type JSX } from 'react';
import { isTag } from '../../utils/utils';
import { mdxComponents } from './mdx-components';

// inlined from markdoc because
// - it's so trivial to write
// - the markdoc implementation was doing weird things with the components(you couldn't override built in tags)
// - to avoid bundling all of markdoc on the front-end
function renderMarkdoc(node: RenderableTreeNodes) {
  function deepRender(value: any): any {
    if (value == null || typeof value !== 'object') return value;

    if (Array.isArray(value)) return value.map(item => deepRender(item));

    if (value.$$mdtype === 'Tag') return render(value);

    if (typeof value !== 'object') return value;

    const output: Record<string, Scalar> = {};
    for (const [k, v] of Object.entries(value)) output[k] = deepRender(v);
    return output;
  }

  function render(node: RenderableTreeNodes): ReactNode {
    if (Array.isArray(node)) {
      return React.createElement(React.Fragment, null, ...node.map(render));
    }

    if (node === null || typeof node !== 'object') return node;
    if (!isTag(node)) throw new Error('expected a node');

    const {
      name,
      attributes: { class: className, ...attrs } = {},
      children = [],
    } = node;

    if (className) attrs.className = className;
    let elementType = mdxComponents[name];
    if (elementType === undefined) {
      if (name[0].toLowerCase() === name[0]) {
        elementType = name as ElementType;
      } else {
        throw new Error(`No renderer provided for element type: ${name}`);
      }
    }

    return React.createElement(
      elementType,
      Object.keys(attrs).length == 0 ? null : deepRender(attrs),
      ...children.map(render)
    );
  }

  return render(node);
}

export function DocContent({ content }: { content: RenderableTreeNode }) {
  return renderMarkdoc(content) as JSX.Element;
}
