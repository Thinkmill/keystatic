'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function useIsVisible() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handler = () => {
      setIsVisible(document.visibilityState === 'visible');
    };
    handler();
    document.addEventListener('visibilitychange', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  }, []);
  return isVisible;
}
function ReaderRefreshClient(props) {
  const isVisible = useIsVisible();
  const router = useRouter();
  useEffect(() => {
    if (isVisible) {
      const abortController = new AbortController();
      const fetchThing = async () => {
        while (!abortController.signal.aborted) {
          try {
            const res = await fetch(`/api/keystatic/reader-refresh/${props.currentKey}`, {
              signal: abortController.signal
            });
            if (res.status === 404) {
              return;
            }
            if (res.ok) {
              const key = await res.text();
              if (key !== props.currentKey) {
                router.refresh();
                return;
              }
            }
          } catch {}
        }
      };
      fetchThing();
      return () => {
        abortController.abort();
      };
    }
  }, [props.currentKey, router, isVisible]);
  return null;
}

export { ReaderRefreshClient };
