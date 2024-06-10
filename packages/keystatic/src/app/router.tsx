import React, {
  createContext,
  ReactNode,
  startTransition,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Router = {
  push: (path: string) => void;
  replace: (path: string) => void;
  href: string;
  params: string[];
  pathname: string;
  search: string;
};

const RouterContext = createContext<Router | null>(null);

export function RouterProvider(props: { children: ReactNode }) {
  const [url, setUrl] = useState(() => window.location.href);

  function navigate(url: string, replace: boolean) {
    const newUrl = new URL(url, window.location.href);
    if (
      newUrl.origin !== window.location.origin ||
      !newUrl.pathname.startsWith('/keystatic')
    ) {
      window.location.assign(newUrl);
      return;
    }
    window.history[replace ? 'replaceState' : 'pushState'](null, '', newUrl);
    startTransition(() => {
      setUrl(newUrl.toString());
    });
  }
  function replace(path: string) {
    navigate(path, true);
  }
  function push(path: string) {
    navigate(path, false);
  }
  const parsedUrl = new URL(url);
  const replaced = parsedUrl.pathname.replace(/^\/keystatic\/?/, '');
  const params =
    replaced === '' ? [] : replaced.split('/').map(decodeURIComponent);
  const router = {
    href: parsedUrl.pathname + parsedUrl.search,
    pathname: parsedUrl.pathname,
    search: parsedUrl.search,
    replace,
    push,
    params,
  };
  useEffect(() => {
    const handleNavigate = () => {
      startTransition(() => {
        setUrl(window.location.href);
      });
    };
    window.addEventListener('popstate', handleNavigate);
    return () => {
      window.removeEventListener('popstate', handleNavigate);
    };
  }, []);
  return (
    <RouterContext.Provider value={router}>
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
