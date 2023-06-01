import { ReactNode } from 'react';
import { DEFAULT_IMG_WIDTHS } from '../constants';

export function cx(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function getDefaultSrcSet({ src }: { src: string }) {
  const imgWidths = DEFAULT_IMG_WIDTHS;

  return imgWidths.map(width => `${src}?width=${width} ${width}w`).join(', ');
}

export function getTextNode(node: ReactNode): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  // Node object expected for Headings
  if (
    typeof node === 'object' &&
    'text' in node &&
    typeof node.text === 'string'
  ) {
    return node.text;
  }
  if (node instanceof Array) return node.map(getTextNode).join('');
  if (typeof node === 'object' && 'props' in node && 'node' in node.props) {
    return getTextNode(node.props.node);
  }
  if (
    typeof node === 'object' &&
    'children' in node &&
    node.children instanceof Array
  ) {
    return getTextNode(node.children);
  }
  return '';
}
