import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Config } from '../config';
import { Keystatic } from './ui';
import { Router } from './router';

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

export function makePage(config: Config<any, any>) {
  return function Page() {
    const isClient = useIsClient();
    const router = useRouter();
    let href = usePathname()!;
    const searchParams = useSearchParams().toString();
    if (searchParams) {
      href += `?${searchParams}`;
    }
    const keystaticRouter = useMemo((): Router => {
      const replaced = href.replace(/^\/keystatic\/?/, '');
      const params = replaced === '' ? [] : replaced.split('/');
      return {
        href,
        params,
        push: async path => {
          router.push(path);
        },
        replace: async path => {
          router.replace(path);
        },
      };
    }, [href, router]);
    if (!isClient) return null;
    return <Keystatic router={keystaticRouter} config={config} link={Link} />;
  };
}
