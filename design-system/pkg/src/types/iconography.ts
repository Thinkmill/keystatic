import { DOMProps } from '@react-types/shared';
import { ReactElement } from 'react';

import { BaseStyleProps, ColorForeground, SizeIcon } from '@keystar/ui/style';

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
