import { DEFAULT_IMG_WIDTHS } from '../constants';

export function cx(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function getDefaultSrcSet({ src }: { src: string }) {
  const imgWidths = DEFAULT_IMG_WIDTHS;

  return imgWidths.map(width => `${src}?width=${width} ${width}w`).join(', ');
}

export async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  }
}
