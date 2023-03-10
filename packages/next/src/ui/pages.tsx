import { useRouter } from 'next/router';
import Link from 'next/link';
import { useMemo } from 'react';
import { Config } from '@keystatic/core';
import { Keystatic, Router } from '@keystatic/core/ui';

export function makePage(config: Config<any, any>) {
  return function Page() {
    const router = useRouter();
    const keystaticRouter = useMemo((): null | Router => {
      if (!router.isReady) return null;
      const params = (router.query.params ??
        router.query.rest ??
        []) as string[];

      return {
        href: router.asPath,
        params,
        push: path => {
          router.push(path);
        },
        replace: path => {
          router.replace(path);
        },
      };
    }, [router]);
    if (!keystaticRouter) return null;
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
