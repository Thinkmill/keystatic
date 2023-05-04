import { VirtualElement } from '@floating-ui/react';

type VirtualElementWithClientRects = VirtualElement & {
  getClientRects: () => DOMRectList;
};

export function getVirtualElementFromRange(
  range: Range
): VirtualElementWithClientRects {
  return {
    getBoundingClientRect: () => range.getBoundingClientRect(),
    getClientRects: () => range.getClientRects(),
  };
}
