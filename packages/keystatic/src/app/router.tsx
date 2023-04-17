import { createContext, ReactNode, useContext } from 'react';

export type Router = {
  push: (path: string) => void;
  replace: (path: string) => void;
  href: string;
  params: string[];
};

const RouterContext = createContext<Router | null>(null);

export function RouterProvider(props: { router: Router; children: ReactNode }) {
  return (
    <RouterContext.Provider value={props.router}>
      {props.children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const router = useContext(RouterContext);
  if (router == null) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return router;
}
