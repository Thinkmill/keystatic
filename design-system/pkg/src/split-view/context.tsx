import { createContext, useContext } from 'react';

import { ResizeActivity } from './types';

type ContextType = { id: string; activity: ResizeActivity };
const SplitViewContext = createContext<ContextType>({
  id: '',
  activity: undefined,
});

/** @private */
export const SplitViewProvider = SplitViewContext.Provider;

/** @private */
export function useSplitView() {
  return useContext(SplitViewContext);
}
