import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
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

export function makePage(config: Config<any, any>) {
  return function Page() {
    const isClient = useIsClient();
    const router = useRouter();
    const pathname = usePathname()!;
    let href = pathname;
    const searchParams = useSearchParams()!.toString();
    if (searchParams) {
      href += `?${searchParams}`;
    }
    const keystaticRouter = useMemo((): Router => {
      const replaced = pathname.replace(/^\/keystatic\/?/, '');
      const params =
        replaced === '' ? [] : replaced.split('/').map(decodeURIComponent);
      return {
        href,
        params,
        push: async path => {
          router.push(path, { forceOptimisticNavigation: true });
        },
        replace: async path => {
          router.replace(path, { forceOptimisticNavigation: true });
        },
      };
    }, [href, router, pathname]);
    if (!isClient) return null;
    return (
      <Keystatic
        router={keystaticRouter}
        config={config}
        link={Link}
        appSlug={appSlug}
      />
    );
  };
}

const appSlug = {
  envName: 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  value: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
};
