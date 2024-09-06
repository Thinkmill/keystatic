import { tokenSchema } from '@keystar/ui/style';

export const gapVar = tokenSchema.size.space.regular;
export const heightVar = tokenSchema.size.element.small;
export const radiusVar = tokenSchema.size.radius.small;

export const tokenValues = {
  gap: 8,
  height: 24,
};

// TODO: revisit this approach, so we can keep things in-sync
// export function getNumericTokenValues() {
//   const computedStyle = window.getComputedStyle(document.body);
//   const gap = computedStyle.getPropertyValue(unwrapCssVar(gapVar));
//   const height = computedStyle.getPropertyValue(unwrapCssVar(heightVar));
//   return {
//     gap: parseInt(gap, 10),
//     height: parseInt(height, 10),
//   };
// }
// function unwrapCssVar(value: string) {
//   return value.slice(4, -1);
// }
