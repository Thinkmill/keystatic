import { createContext, useContext } from 'react';

import { ResizeActivity } from './types';

type ContextType = {
  activity: ResizeActivity;
  id: string;
  isCollapsed: boolean | undefined;
};
const SplitViewContext = createContext<ContextType>({
  activity: undefined,
  id: '',
  isCollapsed: undefined,
});

/** @private */
export const SplitViewProvider = SplitViewContext.Provider;

/** @private */
export function useSplitView() {
  return useContext(SplitViewContext);
}
