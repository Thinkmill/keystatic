import { BaseStyleProps, SizeBorder } from '@keystar-ui/style';

import { AriaLabellingProps, DOMProps } from './dom';

export type Orientation = 'horizontal' | 'vertical';

export type DividerProps = {
  /**
   * The axis the Divider should align with.
   * @default 'horizontal'
   */
  orientation?: Orientation;
  /**
   * How thick the Divider should be.
   * @default 'regular'
   */
  size?: SizeBorder; // NOTE: prefer "weight"?
  /**
   * A slot to place the divider in.
   * @default 'divider'
   */
  slot?: string;
} & AriaLabellingProps &
  DOMProps &
  BaseStyleProps;
