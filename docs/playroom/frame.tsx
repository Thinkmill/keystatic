import { ReactNode } from 'react';

import { VoussoirProvider } from '@voussoir/core';

export default function FrameComponent({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <VoussoirProvider>{children}</VoussoirProvider>;
}
