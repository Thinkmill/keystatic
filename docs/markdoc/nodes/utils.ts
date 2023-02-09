import { Node } from '@markdoc/markdoc';
import slugify from '@sindresorhus/slugify';

export function getIdForHeading(node: Node): string {
  if (typeof node.attributes.id === 'string') {
    return node.attributes.id;
  }
  let stringified = '';
  for (const child of node.walk()) {
    if (child.type === 'text' || child.type === 'code') {
      stringified += child.attributes.content;
    }
  }
  return slugify(stringified);
}
