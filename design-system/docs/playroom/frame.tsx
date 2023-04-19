import { ReactNode } from 'react';

import {
  ClientSideOnlyDocumentElement,
  KeystarUIProvider,
} from '@keystar-ui/core';

export default function FrameComponent({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <KeystarUIProvider>
      <ClientSideOnlyDocumentElement />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </KeystarUIProvider>
  );
}
