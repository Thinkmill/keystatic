import { ClassNamesArg } from '@emotion/css';
import { MaybeArray } from '@keystar/ui/types';
import { CSSProperties } from 'react';

import { tokenSchema } from './tokens';

export type CSSProp = keyof CSSProperties;
export type Primitive = number | string | boolean | null | undefined;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export type StyleTarget = MaybeArray<CSSProp>;
export type StyleResolver<T = unknown> = (
  value: T
) => T | number | string | boolean | null | undefined;
export type StyleResolverMap = Record<string, [StyleTarget, StyleResolver]>;

// THEME
// ============================================================================

export type VoussoirTheme = typeof tokenSchema;

// TODO: should sub-types be derived here?

// bad idea???
type ColorAliases = `color.alias.${keyof VoussoirTheme['color']['alias']}`;
type KeysStartingWith<
  Keys,
  Prefix extends string,
> = Keys extends `${Prefix}${string}` ? Keys : never;

type BackgroundAliases = KeysStartingWith<
  ColorAliases,
  'color.alias.background'
>;
type BorderAliases = KeysStartingWith<ColorAliases, 'color.alias.border'>;
// type ForegroundAliases = KeysStartingWith<ColorAliases, 'color.alias.foreground'>;

export type AnimationDuration = keyof VoussoirTheme['animation']['duration'];
export type AnimationEasing = keyof VoussoirTheme['animation']['easing'];

export type ColorBackground =
  | keyof VoussoirTheme['color']['background']
  | BackgroundAliases;
export type ColorBorder =
  | keyof VoussoirTheme['color']['border']
  | BorderAliases;
export type ColorForeground =
  | keyof VoussoirTheme['color']['foreground']
  | ColorAliases;
export type ColorShadow = keyof VoussoirTheme['color']['shadow'];

export type FontFamily = keyof VoussoirTheme['typography']['fontFamily'];
export type FontWeight = keyof VoussoirTheme['typography']['fontWeight'];
export type FontSizeHeading = keyof VoussoirTheme['typography']['heading'];
export type FontSizeText = keyof VoussoirTheme['typography']['text'];

export type SizeBorder = keyof VoussoirTheme['size']['border'];
export type SizeElement = keyof VoussoirTheme['size']['element'];
export type SizeIcon = keyof VoussoirTheme['size']['icon'];
export type SizeRadius = keyof VoussoirTheme['size']['radius'];
export type SizeShadow = keyof VoussoirTheme['size']['shadow'];
export type SizeSpace = keyof VoussoirTheme['size']['space'];

type Sizes = VoussoirTheme['size'];
export type DimensionKey =
  | `alias.${keyof Sizes['alias']}`
  | `border.${keyof Sizes['border']}`
  | `container.${keyof Sizes['container']}`
  | `element.${keyof Sizes['element']}`
  | `icon.${keyof Sizes['icon']}`
  | `scale.${keyof Sizes['scale']}`;

// PROPS
// ============================================================================

// TODO: remove this type, it's unsafe.
export type Loose<T> = T | number | (string & {});
export type LooseSizeDimension =
  | DimensionKey
  | 0
  | 'auto'
  | 'inherit'
  | '100%'
  | '100vh'
  | '100vw';
export type LooseSizeSpace = Loose<SizeSpace>;

export type ResponsiveProp<T> = Partial<Record<Breakpoint, T>>;
export type Responsive<T> = T | ResponsiveProp<T>;

type BorderStyle = 'none' | 'dashed' | 'dotted' | 'solid';
type OverflowValue = 'visible' | 'hidden' | 'scroll' | 'clip' | 'auto';
type BreakpointAbove = Exclude<Breakpoint, 'wide'>;
type BreakpointBelow = Exclude<Breakpoint, 'mobile'>;
export type BreakpointRange =
  | { above: BreakpointAbove }
  | { below: BreakpointBelow }
  | boolean;

export type RootStyleProps = {
  /** Responsively hide the element, visually **and** from assistive tech. */
  isHidden?: BreakpointRange;
  /** Sets the CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. Only use as a **last resort**, prefer style props instead. */
  UNSAFE_className?: ClassNamesArg;
  /** Sets inline [style](https://developer.mozilla.org/en-US/docs/Web/API/Element/style) for the element. Only use as a **last resort**, prefer style props instead. */
  UNSAFE_style?: CSSProperties;
};

// NOTE: The "base" style props may be applied to high-level components, not
// just layout or typographic primitives
export type BaseStyleProps = RootStyleProps & {
  /** The margin for all four sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin). */
  margin?: Responsive<LooseSizeSpace>;
  /** The margin for the logical start side of the element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-start). */
  marginStart?: Responsive<LooseSizeSpace>;
  /** The margin for the logical end side of an element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-end). */
  marginEnd?: Responsive<LooseSizeSpace>;
  /** The margin for the top side of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top). */
  marginTop?: Responsive<LooseSizeSpace>;
  /** The margin for the bottom side of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom). */
  marginBottom?: Responsive<LooseSizeSpace>;
  /** The margin for both the left and right sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin). */
  marginX?: Responsive<LooseSizeSpace>;
  /** The margin for both the top and bottom sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin). */
  marginY?: Responsive<LooseSizeSpace>;

  /** The width of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/width). */
  width?: Responsive<LooseSizeDimension>;
  /** The height of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/height). */
  height?: Responsive<LooseSizeDimension>;
  /** The minimum width of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width). */
  minWidth?: Responsive<LooseSizeDimension>;
  /** The minimum height of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/min-height). */
  minHeight?: Responsive<LooseSizeDimension>;
  /** The maximum width of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width). */
  maxWidth?: Responsive<LooseSizeDimension>;
  /** The maximum height of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/max-height). */
  maxHeight?: Responsive<LooseSizeDimension>;

  /** When used in a flex layout, specifies how the element will grow or shrink to fit the space available. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex). */
  flex?: Responsive<string | number | boolean>;
  /** When used in a flex layout, specifies how the element will grow to fit the space available. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow). */
  flexGrow?: Responsive<number>;
  /** When used in a flex layout, specifies how the element will shrink to fit the space available. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink). */
  flexShrink?: Responsive<number>;
  /** When used in a flex layout, specifies the initial main size of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-basis). */
  flexBasis?: Responsive<number | string>;
  /** Specifies how the element is justified inside a flex or grid container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-self). */
  justifySelf?: Responsive<
    Exclude<CSSProperties['justifySelf'], 'left' | 'right'>
  >;
  /** Overrides the `alignItems` property of a flex or grid container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self). */
  alignSelf?: Responsive<CSSProperties['alignSelf']>;
  /** The layout order for the element within a flex or grid container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/order). */
  order?: Responsive<number>;

  /** When used in a grid layout, specifies the named grid area that the element should be placed in within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area). */
  gridArea?: Responsive<string>;
  /** When used in a grid layout, specifies the column the element should be placed in within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column). */
  gridColumn?: Responsive<string>;
  /** When used in a grid layout, specifies the row the element should be placed in within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row). */
  gridRow?: Responsive<string>;
  /** When used in a grid layout, specifies the starting column to span within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-start). */
  gridColumnStart?: Responsive<string>;
  /** When used in a grid layout, specifies the ending column to span within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-end). */
  gridColumnEnd?: Responsive<string>;
  /** When used in a grid layout, specifies the starting row to span within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-start). */
  gridRowStart?: Responsive<string>;
  /** When used in a grid layout, specifies the ending row to span within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-end). */
  gridRowEnd?: Responsive<string>;

  /** Specifies how the element is positioned. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/position). */
  position?: Responsive<CSSProperties['position']>;
  /** Shorthand that corresponds to the top, right, bottom, and/or left properties. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inset). */
  inset?: Responsive<LooseSizeSpace>;
  /** The top position for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/top). */
  insetTop?: Responsive<LooseSizeSpace>;
  /** The bottom position for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/bottom). */
  insetBottom?: Responsive<LooseSizeSpace>;
  /** The logical start position for the element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-start). */
  insetStart?: Responsive<LooseSizeSpace>;
  /** The logical end position for the element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-end). */
  insetEnd?: Responsive<LooseSizeSpace>;
  /** The inset for both left and right. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline). */
  insetX?: Responsive<LooseSizeSpace>;
  /** The inset for both top and bottom. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block). */
  insetY?: Responsive<LooseSizeSpace>;
  /** The stacking order for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index). */
  zIndex?: Responsive<number>;
};

export type BoxStyleProps = {
  /** The background color for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color). */
  // NOTE: must be unresponsive to allow descendent text color decisions
  backgroundColor?: ColorBackground;

  /** Shorthand for the element's border on all four sides. It sets the values of border-width, border-style, and border-color. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border). */
  border?: Responsive<ColorBorder>;
  /** Shorthand for the border on the logical start side, depending on the layout direction. It sets the values of border-width, border-style, and border-color. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start). */
  borderStart?: Responsive<ColorBorder>;
  /** Shorthand for the border on the logical end side, depending on the layout direction. It sets the values of border-width, border-style, and border-color. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end). */
  borderEnd?: Responsive<ColorBorder>;
  /** Shorthand for the top border. It sets the values of border-width, border-style, and border-color. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top). */
  borderTop?: Responsive<ColorBorder>;
  /** Shorthand for the bottom border. It sets the values of border-width, border-style, and border-color. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom). */
  borderBottom?: Responsive<ColorBorder>;

  /** The color of the element's border on all four sides. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color). */
  borderColor?: Responsive<ColorBorder>;
  /** The color of the border on the logical start side, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start-color). */
  borderStartColor?: Responsive<ColorBorder>;
  /** The color of the border on the logical end side, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end-color). */
  borderEndColor?: Responsive<ColorBorder>;
  /** The color of the top border. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-color). */
  borderTopColor?: Responsive<ColorBorder>;
  /** The color of the bottom border. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-color). */
  borderBottomColor?: Responsive<ColorBorder>;

  /** The style of the element's border on all four sides. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-style). */
  borderStyle?: Responsive<BorderStyle>;
  /** The style of the border on the logical start side, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start-style). */
  borderStartStyle?: Responsive<BorderStyle>;
  /** The style of the border on the logical end side, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end-style). */
  borderEndStyle?: Responsive<BorderStyle>;
  /** The style of the top border. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-style). */
  borderTopStyle?: Responsive<BorderStyle>;
  /** The style of the bottom border. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-style). */
  borderBottomStyle?: Responsive<BorderStyle>;

  /** The width of the element's border on all four sides. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width). */
  borderWidth?: Responsive<SizeBorder>;
  /** The width of the border on the logical start side, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start-width). */
  borderStartWidth?: Responsive<SizeBorder>;
  /** The width of the border on the logical end side, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end-width). */
  borderEndWidth?: Responsive<SizeBorder>;
  /** The width of the top border. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width). */
  borderTopWidth?: Responsive<SizeBorder>;
  /** The width of the bottom border. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width). */
  borderBottomWidth?: Responsive<SizeBorder>;

  /** The border radius on all four sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius). */
  borderRadius?: Responsive<SizeRadius>;
  /** The border radius for the top start corner of the element, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-start-start-radius). */
  borderTopStartRadius?: Responsive<SizeRadius>;
  /** The border radius for the top end corner of the element, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-start-end-radius). */
  borderTopEndRadius?: Responsive<SizeRadius>;
  /** The border radius for the bottom start corner of the element, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-end-start-radius). */
  borderBottomStartRadius?: Responsive<SizeRadius>;
  /** The border radius for the bottom end corner of the element, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-end-end-radius). */
  borderBottomEndRadius?: Responsive<SizeRadius>;

  /** Adds shadow effects around an element's frame. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow). */
  boxShadow?: Responsive<SizeShadow | `${SizeShadow} ${ColorShadow}`>;

  /** The padding for all four sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding). */
  padding?: Responsive<LooseSizeSpace>;
  /** The padding for the logical start side of the element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-start). */
  paddingStart?: Responsive<LooseSizeSpace>;
  /** The padding for the logical end side of an element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-end). */
  paddingEnd?: Responsive<LooseSizeSpace>;
  /** The padding for the top side of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top). */
  paddingTop?: Responsive<LooseSizeSpace>;
  /** The padding for the bottom side of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom). */
  paddingBottom?: Responsive<LooseSizeSpace>;
  /** The padding for both the left and right sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding). */
  paddingX?: Responsive<LooseSizeSpace>;
  /** The padding for both the top and bottom sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding). */
  paddingY?: Responsive<LooseSizeSpace>;

  /** The type of mouse cursor, if any, to show when the mouse pointer is over an element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) */
  cursor?: Responsive<CSSProperties['cursor']>;
  /** The opacity of an element. Opacity is the degree to which content behind an element is hidden, and is the opposite of transparency. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity) */
  opacity?: Responsive<number>;
  /** Specify what to do when the element's content is too long to fit its size. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow). */
  overflow?: Responsive<OverflowValue | `${OverflowValue} ${OverflowValue}`>;
  /** Sets under what circumstances (if any) a particular element can become the target of pointer events. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events). */
  pointerEvents?: Responsive<CSSProperties['pointerEvents']>;
  /** Controls whether the user can select text. This doesn't have any effect on content loaded as part of a browser's user interface (its chrome), except in textboxes. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select). */
  userSelect?: Responsive<CSSProperties['userSelect']>;
} & BaseStyleProps;

export type BoxAlignmentStyleProps = {
  /**
   * The distribution of space around items along the main axis. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content).
   * @default 'stretch'
   */
  justifyContent?: Responsive<
    Exclude<CSSProperties['justifyContent'], 'left' | 'right'>
  >;
  /**
   * The distribution of space around child items along the cross axis. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content).
   * @default 'start'
   */
  alignContent?: Responsive<CSSProperties['alignContent']>;
  /**
   * The alignment of children within their container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items).
   * @default 'stretch'
   */
  alignItems?: Responsive<CSSProperties['alignItems']>;
  /** The space to display between both rows and columns. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/gap). */
  gap?: Responsive<LooseSizeSpace>;
  /** The space to display between columns. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap). */
  columnGap?: Responsive<LooseSizeSpace>;
  /** The space to display between rows. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap). */
  rowGap?: Responsive<LooseSizeSpace>;
};

export type FlexStyleProps = {
  /**
   * The direction in which to layout children. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction).
   * @default 'row'
   */
  direction?: Responsive<'row' | 'column' | 'row-reverse' | 'column-reverse'>;
  /**
   * Whether to display the element as "inline". See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/display-outside#inline).
   * @default false
   */
  inline?: Responsive<boolean>;
  /**
   * Whether to wrap items onto multiple lines. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap).
   * @default false
   */
  wrap?: Responsive<boolean | 'wrap' | 'nowrap' | 'wrap-reverse'>;
} & BoxAlignmentStyleProps &
  Omit<BoxStyleProps, 'display'>;

export type GridStyleProps = {
  /** Defines named grid areas. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas). */
  areas?: Responsive<string[]>;
  /** Defines the sizes of each row in the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows). */
  rows?: Responsive<string | LooseSizeDimension[]>;
  /** Defines the sizes of each column in the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns). */
  columns?: Responsive<string | LooseSizeDimension[]>;
  /** Defines the size of implicitly generated columns. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-columns). */
  autoColumns?: Responsive<string | LooseSizeDimension>;
  /** Defines the size of implicitly generated rows. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-rows). */
  autoRows?: Responsive<string | LooseSizeDimension>;
  /** Controls how auto-placed items are flowed into the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow). */
  autoFlow?: Responsive<'row' | 'column' | 'row dense' | 'column dense'>;
  /**
   * Whether to display the element as "inline". See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/display-outside#inline).
   * @default false
   */
  inline?: Responsive<boolean>;
  /** Defines the default `justifySelf` for all items in the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-items). */
  justifyItems?: Responsive<
    Exclude<CSSProperties['justifyItems'], 'left' | 'right'>
  >;
} & BoxAlignmentStyleProps &
  Omit<BoxStyleProps, 'display'>;
