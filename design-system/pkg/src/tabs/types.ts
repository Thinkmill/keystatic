import type {
  TabListProps as AriaTabListProps,
  TabPanelProps as AriaTabPanelProps,
  TabPanelsProps as AriaTabPanelsProps,
  TabProps as AriaTabProps,
  TabsProps as AriaTabsProps,
} from 'react-aria-components/Tabs';

import type { BaseStyleProps } from '@keystar/ui/style';

export type TabProminence = 'low' | 'default';

export interface TabsProps
  extends Omit<AriaTabsProps, 'className' | 'style'>,
    BaseStyleProps {
  prominence?: TabProminence;
}

export interface TabListProps<T>
  extends Omit<AriaTabListProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

export interface TabProps
  extends Omit<AriaTabProps, 'className' | 'style'>,
    BaseStyleProps {}

export interface TabPanelsProps<T>
  extends Omit<AriaTabPanelsProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

export interface TabPanelProps
  extends Omit<AriaTabPanelProps, 'className' | 'style'>,
    BaseStyleProps {}
