import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';

import {
  BaseStyleProps,
  BreakpointRange,
  ColorForeground,
  FontSizeHeading,
  FontSizeText,
  FontWeight,
} from '@keystar/ui/style';

// ============================================================================
// HEADING
// ============================================================================

export type HeadingProps = {
  /**
   * The horizontal alignment of content inside the heading element.
   *
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * The content of the heading element.
   */
  children: ReactNode;
  /**
   * The size of the heading.
   *
   * Also used to derive the underlying HTML element, unless an explicit
   * `elementType` is provided.
   */
  size?: FontSizeHeading;
  /**
   * A slot to place the heading in.
   * @default 'heading'
   */
  slot?: string;
  /**
   * Limit the contents of the element to the specified number of lines, or
   * provide a shorthand boolean to conveniently express a single line.
   */
  truncate?: number | boolean;
  /**
   * Hides children visually, while keeping content visible to screen readers.
   */
  visuallyHidden?: BreakpointRange;
} & BaseStyleProps &
  DOMProps;

// ============================================================================
// TEXT
// ============================================================================

export type TextProps = {
  /**
   * The horizontal alignment of content inside the text element. **Does NOT** apply to nested text.
   *
   * Use logical properties "start" and "end" in most cases, since they respond
   * to locale direction. Only use special values "FORCE_left" and
   * "FORCE_right" in rare cases where locale direction should be
   * ignored, such as numeric text within a tabular container.
   *
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end' | 'FORCE_left' | 'FORCE_right';
  /**
   * How to capitalize the element's contents.
   *
   * @default 'none'
   */
  casing?: 'capitalize' | 'lowercase' | 'none' | 'uppercase' | 'full-width';
  /**
   * The content of the text element.
   */
  children?: ReactNode;
  /**
   * The color of the text.
   *
   * @default 'neutral'
   */
  color?: 'inherit' | ColorForeground;
  /**
   * How to handle white space and line breaks when the text would otherwise
   * overflow its content box.
   *
   * @default 'breakword'
   */
  overflow?: 'breakword' | 'nowrap' | 'unset';
  /**
   * The size of the text.
   *
   * @default 'regular'
   */
  size?: FontSizeText;
  /**
   * A slot to place the text in.
   *
   * @default 'text'
   */
  slot?: string;
  /**
   * The title attribute contains text representing advisory information related
   * to the element it belongs to. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title).
   */
  title?: string;
  /**
   * Trim the space above capital letters and below the baseline. **Does NOT** apply to nested text.
   *
   * @default true
   */
  trim?: boolean;
  /**
   * Limit the contents of the element to the specified number of lines, or
   * provide a shorthand boolean to conveniently express a single line.
   */
  truncate?: number | boolean;
  /**
   * Control the usage of alternate glyphs for numbers, fractions, and ordinal
   * markers. See [MDN
   * font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)
   * for more information.
   *
   * @default 'normal'
   */
  variant?:
    | 'normal' // This keyword leads to the deactivation of the use of such alternate glyphs.
    | 'diagonal-fractions' // the set of figures where the numerator and denominator are made smaller and separated by a slash. It corresponds to the OpenType values `frac`.
    | 'ordinal' // This keyword forces the use of special glyphs for the ordinal markers, like 1st, 2nd, 3rd, 4th in English or a 1a in Italian. It corresponds to the OpenType values `ordn`.
    | 'slashed-zero' //This keyword forces the use of a 0 with a slash; this is useful when a clear distinction between O and 0 is needed. It corresponds to the OpenType values `zero`.
    | 'tabular-nums'; // Activates the set of figures where numbers are all of the same size, allowing them to be easily aligned like in tables. It corresponds to the OpenType values `tnum`.
  /**
   * Hides children visually, while keeping content visible to screen readers.
   */
  visuallyHidden?: BreakpointRange;
  /**
   * The weight of the text.
   *
   * @default 'regular'
   * */
  weight?: 'inherit' | FontWeight;
} & BaseStyleProps &
  DOMProps;
