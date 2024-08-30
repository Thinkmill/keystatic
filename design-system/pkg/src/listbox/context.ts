import { ListState } from '@react-stately/list';
import { assert } from 'emery';
import { type ReactNode, createContext, useContext } from 'react';

interface ListBoxContextValue {
  state: ListState<unknown>;
  renderEmptyState?: () => ReactNode;
  shouldFocusOnHover: boolean;
  shouldUseVirtualFocus: boolean;
}
export const ListBoxContext = createContext<ListBoxContextValue | null>(null);

export function useListBoxContext() {
  let context = useContext(ListBoxContext);
  assert(!!context, 'ListBoxContext is missing');
  return context;
}
