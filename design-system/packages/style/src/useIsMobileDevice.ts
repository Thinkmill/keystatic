import { useIsSSR } from '@keystar-ui/ssr';

import { breakpoints } from './responsive';

export function useIsMobileDevice() {
  let isSSR = useIsSSR();
  if (isSSR || typeof window === 'undefined') {
    return false;
  }

  return window.screen.width <= breakpoints.tablet;
}
