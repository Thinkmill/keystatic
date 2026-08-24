/* eslint-disable react-compiler/react-compiler */
import { createContext, ReactNode, useContext } from 'react';

import type { Router } from './types';

const RouterContext = createContext<Router | null>(null);

const hookIds = new WeakMap<() => unknown, number>();
let nextHookId = 1;

function getHookId(hook: (() => unknown) | undefined) {
  if (hook === undefined) return 0;
  let id = hookIds.get(hook);
  if (id === undefined) {
    id = nextHookId++;
    hookIds.set(hook, id);
  }
  return id;
}

function getRouterHooksKey(router: Router) {
  return `${getHookId(router.usePathname)}:${getHookId(router.useSearch)}`;
}

export function RouterContextProvider({
  children,
  router,
}: {
  children: ReactNode;
  router: Router;
}) {
  return (
    <RouterContext.Provider key={getRouterHooksKey(router)} value={router}>
      {children}
    </RouterContext.Provider>
  );
}

function useRouterContext() {
  const context = useContext(RouterContext);
  if (context === null) {
    throw new Error(
      'Router hooks must be used within a KeystarProvider with a router.'
    );
  }
  return context;
}

/** Returns the function configured for client-side navigation. */
export function useNavigate(): Router['navigate'] {
  return useRouterContext().navigate;
}

/** Returns the current application-relative pathname. */
export function usePathname(): string {
  const usePathname = useRouterContext().usePathname;
  if (usePathname === undefined) {
    throw new Error(
      'usePathname requires the KeystarProvider router to implement usePathname.'
    );
  }
  return usePathname();
}

/** Returns the current query string, including the leading question mark. */
export function useSearch(): string {
  const useSearch = useRouterContext().useSearch;
  if (useSearch === undefined) {
    throw new Error(
      'useSearch requires the KeystarProvider router to implement useSearch.'
    );
  }
  return useSearch();
}
