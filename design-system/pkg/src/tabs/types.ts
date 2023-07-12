import {
  AriaLabelingProps,
  CollectionChildren,
  DOMProps,
  Orientation,
  SingleSelection,
} from '@react-types/shared';
import { Key, ReactNode } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';

export type TabProminence = 'low' | 'default';

export type TabsProps<T> = {
  /**
   * The children of the <Tabs> element. Should include `<TabList>` and
   * `<TabPanels>` elements.
   */
  children: ReactNode;
  /** The item objects for each tab, for dynamic collections. */
  items?: Iterable<T>;
  /** When true, all tabs are disabled. */
  isDisabled?: boolean;
  /**
   * The keys of the tabs that are disabled. These tabs cannot be selected,
   * focused, or otherwise interacted with.
   */
  disabledKeys?: Iterable<Key>;
  /**
   * The prominence of the tab list.
   * @default 'default'
   */
  prominence?: TabProminence;
  /**
   * The orientation of the tabs.
   * @default 'horizontal'
   */
  orientation?: Orientation;
} & AriaLabelingProps &
  SingleSelection &
  DOMProps &
  BaseStyleProps;

export type TabListProps<T> = {
  /** The tab items to display. Item keys should match the key of the corresponding `<Item>` within the `<TabPanels>` element. */
  children: CollectionChildren<T>;
} & DOMProps &
  BaseStyleProps;

export type TabPanelsProps<T> = {
  /** The contents of each tab. Item keys should match the key of the corresponding `<Item>` within the `<TabList>` element. */
  children: CollectionChildren<T>;
} & DOMProps &
  BaseStyleProps;
