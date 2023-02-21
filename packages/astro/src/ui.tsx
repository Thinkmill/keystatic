import React, {
  AnchorHTMLAttributes,
  forwardRef,
  Ref,
  useContext,
  useMemo,
} from 'react';
import { Config } from '@keystatic/core';
import { Keystatic as GenericKeystatic, Router } from '@keystatic/core/ui';
import {
  createBrowserRouter,
  Link,
  RouterProvider,
  useHref,
  useLocation,
  useNavigate,
} from 'react-router-dom';

const KeystaticLink = forwardRef(function KeystaticLink(
  {
    href,
    ...props
  }: { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>,
  ref: Ref<HTMLAnchorElement>
) {
  return <Link to={href} {...props} ref={ref} />;
});

function ReactRouterKeystatic() {
  const config = useContext(ConfigContext)!;
  const navigate = useNavigate();
  const location = useLocation();
  const href = useHref(location);
  const keystaticRouter = useMemo((): Router => {
    const replaced = href.replace(/^\/keystatic\/?/, '');
    const params =
      replaced === '' ? [] : replaced.split('/').map(decodeURIComponent);

    return {
      push(path) {
        navigate(path);
      },
      replace(path) {
        navigate(path, { replace: true });
      },
      href,
      params,
    };
  }, [navigate, href]);
  return (
    <GenericKeystatic
      router={keystaticRouter}
      config={config}
      link={KeystaticLink}
    />
  );
}

const ConfigContext = React.createContext<Config<any, any> | null>(null);

const router = createBrowserRouter([
  {
    path: '/keystatic/*',
    element: <ReactRouterKeystatic />,
  },
]);

export function makePage(config: Config<any, any>) {
  return function Keystatic() {
    return (
      <ConfigContext.Provider value={config}>
        <RouterProvider router={router} />
      </ConfigContext.Provider>
    );
  };
}
