import { AriaActionGroupProps } from '@react-types/actiongroup';
import { ReactElement } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';

export type ActionGroupProps<T> = AriaActionGroupProps<T> & {
  /**
   * Sets the amount of space between buttons.
   * @default 'regular'
   */
  density?: 'compact' | 'regular';
  /** Whether the buttons should be justified in their container. */
  isJustified?: boolean;
  /**
   * Defines the behavior of the group when the buttons do not fit in the
   * available space. When set to 'wrap', the items wrap to form a new line.
   * When set to 'collapse', the items that do not fit are collapsed into a
   * dropdown menu.
   * @default 'wrap'
   */
  overflowMode?: 'wrap' | 'collapse';
  /**
   * Defines when the text within the buttons should be hidden and only the icon
   * should be shown. When set to 'hide', the text is always shown in a tooltip.
   * When set to 'collapse', the text is visible if space is available, and
   * hidden when space is limited. The text is always visible when the item is
   * collapsed into a menu.
   * @default 'show'
   */
  buttonLabelBehavior?: 'show' | 'collapse' | 'hide';
  /**
   * The prominence of each button in the group.
   * @default 'default'
   */
  prominence?: 'low' | 'default';
  /**
   * The icon to display in the dropdown menu trigger button when a selectable
   * group is collapsed.
   */
  summaryIcon?: ReactElement;
} & BaseStyleProps;
