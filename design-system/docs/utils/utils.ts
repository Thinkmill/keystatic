import type { RenderableTreeNode, Tag } from '@markdoc/markdoc';

export function stringifyDocContent(node: RenderableTreeNode): string {
  if (typeof node === 'string') {
    return node;
  }
  if (node === null || !isTag(node)) {
    return '';
  }
  return node.children.map(stringifyDocContent).join('');
}

export function isTag(tag: unknown): tag is Tag {
  return (
    typeof tag === 'object' &&
    tag !== null &&
    '$$mdtype' in tag &&
    tag.$$mdtype === 'Tag'
  );
}
