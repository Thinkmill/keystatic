import { useRouter } from 'next/router';
import Link from 'next/link';
import { useMemo } from 'react';
import { Config } from '../config';
import { Keystatic } from './ui';
import { Router } from './router';

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
    return <Keystatic router={keystaticRouter} config={config} link={Link} />;
  };
}
