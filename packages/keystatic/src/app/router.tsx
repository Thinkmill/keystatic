import React, {
  createContext,
  ReactNode,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Router = {
  push: (path: string) => void;
  replace: (path: string) => void;
  href: string;
  params: string[];
};

const RouterContext = createContext<Router | null>(null);

export function RouterProvider(props: { children: ReactNode }) {
  const [url, setUrl] = useState(() => window.location.href);

  const router = useMemo((): Router => {
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
    const replaced = location.pathname.replace(/^\/keystatic\/?/, '');
    const params =
      replaced === '' ? [] : replaced.split('/').map(decodeURIComponent);
    const parsedUrl = new URL(url);
    return {
      href: parsedUrl.pathname + parsedUrl.search,
      replace(path) {
        navigate(path, true);
      },
      push(path) {
        navigate(path, false);
      },
      params,
    };
  }, [url]);
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
