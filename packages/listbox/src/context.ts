import { ListState } from '@react-stately/list';
import { assert } from 'emery';
import { createContext, useContext } from 'react';

export const ListBoxContext = createContext<ListState<unknown> | null>(null);

export function useListBoxContext() {
  let context = useContext(ListBoxContext);
  assert(!!context, 'ListBoxContext is missing');
  return context;
}
