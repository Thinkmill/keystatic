import { DEFAULT_IMG_WIDTHS } from '../constants';

export function cx(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function getDefaultSrcSet({ src }: { src: string }) {
  // When there's auth, get a list of the configured sizes for this org
  // If they accept `*`, then fall back to this default
  const imgWidths = DEFAULT_IMG_WIDTHS;

  return imgWidths.map(width => `${src}?width=${width} ${width}w`).join(', ');
}
