import {
  resolveProp,
  resolvePropWithPath,
  StyleResolver,
  FlexStyleProps,
  useStyleProps,
  GridStyleProps,
  filterStyleProps,
  LooseSizeDimension,
  sizeResolver,
} from '@keystar/ui/style';

// Resolvers
// ============================================================================

// Shared
// ----------------------------------------------------------------------------

const sharedStyleProps = {
  gap: resolvePropWithPath('gap', 'size.space'),
  columnGap: resolvePropWithPath('columnGap', 'size.space'),
  rowGap: resolvePropWithPath('rowGap', 'size.space'),

  alignContent: resolveProp('alignContent', flexAlignValue),
  alignItems: resolveProp('alignItems', flexAlignValue),
  direction: resolveProp('flexDirection'),
  justifyContent: resolveProp('justifyContent', flexAlignValue),
};

function displayInline(block: 'flex' | 'grid') {
  // @ts-ignore FIXME: The `StyleResolver` type is not generic enough to support this.
  const resolver: StyleResolver = (inline?: boolean) =>
    inline ? `inline-${block}` : block;
  return resolver;
}

// Flex
// ----------------------------------------------------------------------------

export function useFlexStyleProps(props: FlexStyleProps) {
  return useStyleProps({ inline: false, ...props }, flexStyleProps);
}
export function useFlexProps(props: FlexStyleProps) {
  const styleProps = useFlexStyleProps(props);
  const nonStyleProps = filterStyleProps(props, Object.keys(flexStyleProps));

  return { ...nonStyleProps, ...styleProps };
}

export const flexStyleProps = {
  ...sharedStyleProps,
  direction: resolveProp('flexDirection'),
  inline: resolveProp('display', displayInline('flex')),
  wrap: resolveProp('flexWrap', flexWrapValue),
};

/**
 * Normalize 'start' and 'end' alignment values to 'flex-start' and 'flex-end'
 * in flex containers for browser compatibility.
 */
function flexAlignValue(value: unknown) {
  if (value === 'start') {
    return 'flex-start';
  }
  if (value === 'end') {
    return 'flex-end';
  }

  return value;
}
function flexWrapValue(value: unknown) {
  if (typeof value === 'boolean') {
    return value ? 'wrap' : 'nowrap';
  }

  return value;
}

// Grid
// ----------------------------------------------------------------------------

type FractionUnit = `${number}fr`;
type GridDimension = LooseSizeDimension | FractionUnit;

function isFractionUnit(value: string): value is FractionUnit {
  return value.endsWith('fr');
}
function gridSizeResolver(value: GridDimension) {
  if (typeof value === 'number') {
    return value;
  }
  if (isFractionUnit(value)) {
    return value;
  }

  return sizeResolver(value);
}

export function useGridStyleProps(props: GridStyleProps) {
  return useStyleProps({ inline: false, ...props }, gridStyleProps);
}
export function useGrid(props: GridStyleProps) {
  const styleProps = useGridStyleProps(props);
  const nonStyleProps = filterStyleProps(props, Object.keys(gridStyleProps));

  return { ...nonStyleProps, ...styleProps };
}

export const gridStyleProps = {
  ...sharedStyleProps,
  inline: resolveProp('display', displayInline('grid')),
  autoFlow: resolveProp('gridAutoFlow'),
  // @ts-ignore FIXME: The `StyleResolver` type is not generic enough to support this.
  autoColumns: resolveProp('gridAutoColumns', sizeResolver),
  // @ts-ignore FIXME: The `StyleResolver` type is not generic enough to support this.
  autoRows: resolveProp('gridAutoRows', sizeResolver),
  // @ts-ignore FIXME: The `StyleResolver` type is not generic enough to support this.
  areas: resolveProp('gridTemplateAreas', gridTemplateAreasValue),
  // @ts-ignore FIXME: The `StyleResolver` type is not generic enough to support this.
  columns: resolveProp('gridTemplateColumns', gridTemplateValue),
  // @ts-ignore FIXME: The `StyleResolver` type is not generic enough to support this.
  rows: resolveProp('gridTemplateRows', gridTemplateValue),
  justifyItems: resolveProp('justifyItems'),
  justifyContent: resolveProp('justifyContent'),
  alignItems: resolveProp('alignItems'),
  alignContent: resolveProp('alignContent'),
};

function gridTemplateAreasValue<T>(values: T[]) {
  return values.map(value => `"${value}"`).join('\n');
}
function gridTemplateValue<T extends GridDimension>(value: T | T[]) {
  if (Array.isArray(value)) {
    return value.map(gridSizeResolver).join(' ');
  }

  return value;
}

// Utils
// ============================================================================

/**
 * Can be used to make a repeating fragment of the columns or rows list.
 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/repeat).
 * @param count - The number of times to repeat the fragment.
 * @param repeat - The fragment to repeat.
 */
export function repeat(
  count: number | 'auto-fill' | 'auto-fit',
  repeat: GridDimension
): string {
  return `repeat(${count}, ${gridSizeResolver(repeat)})`;
}

/**
 * Defines a size range greater than or equal to min and less than or equal to max.
 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax).
 * @param min - The minimum size.
 * @param max - The maximum size.
 */
export function minmax(min: GridDimension, max: GridDimension): string {
  return `minmax(${gridSizeResolver(min)}, ${gridSizeResolver(max)})`;
}

/**
 * Clamps a given size to an available size.
 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/fit-content).
 * @param dimension - The size to clamp.
 */
export function fitContent(dimension: GridDimension): string {
  return `fit-content(${gridSizeResolver(dimension)})`;
}
