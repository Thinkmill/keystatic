import { createContext, useContext } from 'react';
import { VoussoirProviderContext } from './types';

// Context is in a separate file to avoid fast refresh issue where the
// old provider context values are immediately replaced with the null default.
export const Context = createContext<VoussoirProviderContext | null>(null);
Context.displayName = 'VoussoirProviderContext';

/**
 * Returns the settings and styles applied by the nearest parent
 * Provider. Properties explicitly set by the nearest parent Provider override
 * those provided by preceeding Providers.
 */
export function useProvider(): VoussoirProviderContext {
  let context = useContext(Context);
  if (!context) {
    throw new Error('Attempt to access context outside of VoussoirProvider.');
  }
  return context;
}

export function useProviderProps<T>(props: T): T {
  let context = useProvider();
  if (!context) {
    return props;
  }
  return Object.assign(
    {},
    {
      // prominence: context.prominence,
      isDisabled: context.isDisabled,
      isRequired: context.isRequired,
      isReadOnly: context.isReadOnly,
    },
    props
  );
}
