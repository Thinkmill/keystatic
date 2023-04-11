import {
  resolveProp,
  resolvePropWithPath,
  StyleResolver,
  FlexStyleProps,
  useStyleProps,
  GridStyleProps,
  filterStyleProps,
} from '@voussoir/style';

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
  autoColumns: resolvePropWithPath('gridAutoColumns', 'size.element'),
  autoRows: resolvePropWithPath('gridAutoRows', 'size.element'),
  // @ts-ignore FIXME: The `StyleResolver` type is not generic enough to support this.
  areas: resolveProp('gridTemplateAreas', gridTemplateAreasValue),
  columns: resolveProp('gridTemplateColumns'),
  rows: resolveProp('gridTemplateRows'),
  justifyItems: resolveProp('justifyItems'),
  justifyContent: resolveProp('justifyContent'),
  alignItems: resolveProp('alignItems'),
  alignContent: resolveProp('alignContent'),
};

function gridTemplateAreasValue<T>(value: T[]) {
  return value.map(v => `"${v}"`).join('\n');
}
