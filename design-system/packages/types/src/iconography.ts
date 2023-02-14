import { BaseStyleProps, ColorForeground, SizeIcon } from '@voussoir/style';
import { ReactElement } from 'react';

import { DOMProps } from './dom';

export type IconProps = {
  src: ReactElement;
  /**
   * The color of the icon.
   * @default 'inherit'
   */
  color?: 'inherit' | ColorForeground;
  /**
   * The size of the icon.
   */
  size?: SizeIcon;
  /**
   * Whether the stroke should scale with the size of the icon.
   * @default true
   */
  strokeScaling?: boolean;
  /**
   * A slot to place the icon in.
   * @default 'icon'
   */
  slot?: string;
} & BaseStyleProps &
  DOMProps;
