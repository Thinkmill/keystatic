import { Link, useNavigate, useLocation, useHref } from '@remix-run/react';
import {
  AnchorHTMLAttributes,
  forwardRef,
  Ref,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Config } from '@keystatic/core';
import { Keystatic, Router } from '@keystatic/core/ui';

let _isClient = false;
function useIsClient() {
  const [isClient, setIsClient] = useState(_isClient);
  useEffect(() => {
    _isClient = true;
    setIsClient(true);
  }, []);
  return isClient;
}

const KeystaticLink = forwardRef(function KeystaticLink(
  {
    href,
    ...props
  }: { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>,
  ref: Ref<HTMLAnchorElement>
) {
  return <Link to={href} {...props} ref={ref} />;
});

export function makePage(config: Config<any, any>) {
  return function Page() {
    const isClient = useIsClient();
    const location = useLocation();
    const href = useHref(location);
    const navigate = useNavigate();
    const keystaticRouter = useMemo((): Router => {
      const replaced = location.pathname.replace(/^\/keystatic\/?/, '');
      const params =
        replaced === '' ? [] : replaced.split('/').map(decodeURIComponent);
      return {
        href,
        params,
        push: async path => {
          navigate(path);
        },
        replace: async path => {
          navigate(path, { replace: true });
        },
      };
    }, [href, navigate, location.pathname]);
    if (!isClient) return null;
    return (
      <Keystatic
        router={keystaticRouter}
        config={config}
        link={KeystaticLink}
      />
    );
  };
}
