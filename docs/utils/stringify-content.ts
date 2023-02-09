import { RenderableTreeNode } from '@markdoc/markdoc';

export function stringifyDocContent(node: RenderableTreeNode): string {
  if (typeof node === 'string') {
    return node;
  }
  if (node === null) {
    return '';
  }
  return node.children.map(stringifyDocContent).join('');
}
