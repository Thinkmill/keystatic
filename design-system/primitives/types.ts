import type StyleDictionary from 'style-dictionary';

export type PlatformInitializer = (
  /** The filename including the extension (e.g. `.css`) and any subfolders after the buildPath (e.g. `functional`). */
  outputFile: string,
  /** The prefix is prepended to all tokens. */
  prefix: string | undefined,
  /** The build path in which the `outputFile` is placed. */
  buildPath: string,
  options?: StyleDictionary.Options
) => StyleDictionary.Platform;

export type ConfigGeneratorOptions = {
  buildPath: string;
  prefix?: string;
  themed?: boolean;
};

export type StyleDictionaryConfigGenerator = (
  outputName: string,
  source: string[],
  include: string[],
  options: ConfigGeneratorOptions,
  platforms?: Record<string, StyleDictionary.Platform | undefined>
) => StyleDictionary.Config;

export type TokenBuildInput = {
  /** The output filename WITHOUT the extension. */
  filename: string;
  /** Array of `filepaths` to token files that should be converted and included in the output. Accepts relative or glob paths. */
  source: string[];
  /** Array of `filepaths` to token files that should NOT be included in the output, but should be available to reference during compilation e.g. base color scales. */
  include: string[];
};

// Tokens
// -----------------------------------------------------------------------------

/**
 * @description a css border string
 * @format color | style | width
 */
export type Border = `${ColorHex} ${string} ${string}`;

/**
 * Type definition for w3c border composite token value
 * @link https://design-tokens.github.io/community-group/format/#border
 */
export type StrokeStyleString =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'outset'
  | 'inset';
export type BorderTokenValue = {
  color: string;
  style: StrokeStyleString;
  width: string;
};

/**
 * @description hex string (6 or 8-digit)
 */
export type ColorHex = string;

/**
 * @description a css cubic bezier string
 * @format x1 | y1 | x2 | y2
 */
export type CubicBezier = string;

/**
 * @description cubic bezier coordinates
 * @link https://design-tokens.github.io/community-group/format/#cubic-bezier
 */
export type CubicBezierTokenValue = [
  x1: number,
  y1: number,
  x2: number,
  y2: number,
];

/**
 * @description a css shadow
 * @format inset? | offset-x | offset-y | blur-radius? | spread-radius? | color?
 */
export type Shadow = string;

/**
 * Type definition for w3c shadow composite token value
 * @link https://design-tokens.github.io/community-group/format/#shadow
 */
export type ShadowTokenValue = {
  color: string;
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
  // custom non w3c values
  inset?: boolean;
  alpha?: number;
};

/**
 * temp shadow partial until we consolidate shadows, which should contain a color value
 */
export type ShadowDimensionTokenValue = Pick<
  ShadowTokenValue,
  'blur' | 'offsetX' | 'offsetY' | 'spread'
>;

/**
 * @description size in px
 */
export type SizePx = `${number}px`;

/**
 * @description size in rem
 */
export type SizeRem = `${number}rem`;

/**
 * Type definition for w3c typography composite token value
 * @link https://design-tokens.github.io/community-group/format/#typography
 */
export type TypographyTokenValue = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  fontStyle?: string;
  letterSpacing?: number;
};

export type w3cTokenType =
  | 'color'
  | 'cubicBezier'
  | 'dimension'
  | 'duration'
  | 'fontFamily'
  | 'fontWeight';
export type w3cCompositeTokenType =
  | 'border'
  | 'gradient'
  | 'shadow'
  | 'strokeStyle'
  | 'transition'
  | 'typography';

export interface w3cTransformedToken extends StyleDictionary.TransformedToken {
  $type?: w3cTokenType | w3cCompositeTokenType;
}
