'use client';
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var navigation = require('next/navigation');
var react = require('react');

function useIsVisible() {
  const [isVisible, setIsVisible] = react.useState(false);
  react.useEffect(() => {
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
  const router = navigation.useRouter();
  react.useEffect(() => {
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

exports.ReaderRefreshClient = ReaderRefreshClient;
