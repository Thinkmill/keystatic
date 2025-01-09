import React, {
  createContext,
  ReactNode,
  startTransition,
  useContext,
  useEffect,
  useState,
} from 'react';

export type RouteInfo = {
  href: string;
  params: string[];
  pathname: string;
  searchParams: URLSearchParams;
};

const RouteInfoContext = createContext<RouteInfo | null>(null);
const NavigateContext = createContext<
  ((href: string, replace?: boolean) => void) | null
>(null);

export function RouterProvider(props: { children: ReactNode }) {
  const [url, setUrl] = useState(() => window.location.href);

  function navigate(url: string, mode: 'push' | 'replace' = 'push') {
    const newUrl = new URL(url, window.location.href);
    if (
      newUrl.origin !== window.location.origin ||
      !newUrl.pathname.startsWith('/keystatic')
    ) {
      window.location.assign(newUrl);
      return;
    }
    window.history[`${mode}State`](null, '', newUrl);
    startTransition(() => {
      setUrl(newUrl.toString());
    });
  }
  const parsedUrl = new URL(url);
  const replaced = parsedUrl.pathname
    .replace(/^\/keystatic\/?/, '')
    .replace(/\/$/, '');
  const params =
    replaced === '' ? [] : replaced.split('/').map(decodeURIComponent);
  const router: RouteInfo = {
    href: parsedUrl.pathname + parsedUrl.search,
    pathname: parsedUrl.pathname,
    searchParams: parsedUrl.searchParams,
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
    <RouteInfoContext.Provider value={router}>
      <NavigateContext.Provider value={navigate}>
        {props.children}
      </NavigateContext.Provider>
    </RouteInfoContext.Provider>
  );
}

export function useMakeHref() {
  const routeInfo = useRouteInfo();
  return;
}

export function useRouteInfo() {
  const routeInfo = useContext(RouteInfoContext);
  if (routeInfo == null) {
    throw new Error('useRouteInfo must be used within a RouterProvider');
  }
  return routeInfo;
}

export function useSearchParams() {
  const routeInfo = useRouteInfo();
  return routeInfo.searchParams;
}

export function useNavigate() {
  const router = useContext(NavigateContext);
  if (router == null) {
    throw new Error('useNavigate must be used within a RouterProvider');
  }
  return router;
}
