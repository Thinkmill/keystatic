export const rgbaFloatToHex = (
  { r, g, b, a }: { r: number; g: number; b: number; a?: number },
  alpha = true
): string => {
  const values = [r, g, b, alpha === true && a ? a : undefined].filter(
    Boolean
  ) as number[];

  return `#${values
    .map(v => `${(v * 255).toString(16)}`.padEnd(2, '0'))
    .join('')}`;
};
