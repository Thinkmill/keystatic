import { TabListState } from '@react-stately/tabs';
import React, { MutableRefObject, useContext } from 'react';
import { TabsProps } from './types';

export type TabContextType<T> = {
  tabProps: TabsProps<T>;
  tabState: {
    tabListState: TabListState<T> | null;
    setTabListState: (state: TabListState<T>) => void;
    selectedTab?: HTMLElement;
    collapsed: boolean;
  };
  refs: {
    wrapperRef: MutableRefObject<HTMLDivElement | null>;
    tablistRef: MutableRefObject<HTMLDivElement | null>;
  };
  tabPanelProps: {
    'aria-labelledby'?: string;
  };
};

export const TabContext = React.createContext<TabContextType<any> | null>(null);

export function useTabContext<T>() {
  let ctx = useContext(TabContext);
  if (!ctx) {
    throw new Error('TabContext not found');
  }
  return ctx as TabContextType<T>;
}
