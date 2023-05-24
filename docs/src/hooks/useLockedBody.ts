import { useLayoutEffect, useState } from 'react';

type UseLockedBodyOutput = [boolean, (locked: boolean) => void];

function useLockedBody(
  initialLocked = false,
  rootId = 'root'
): UseLockedBodyOutput {
  const [locked, setLocked] = useState(initialLocked);

  // Do the side effect before render
  useLayoutEffect(() => {
    if (!locked) {
      return;
    }

    // Save initial body style
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Get the scrollBar width
    const root = document.getElementById(rootId);
    const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0;

    // Avoid width reflow
    if (scrollBarWidth) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;

      if (scrollBarWidth) {
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [locked, rootId]);

  return [locked, setLocked];
}

export default useLockedBody;
