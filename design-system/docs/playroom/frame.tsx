import { ReactNode, type JSX } from 'react';

import {
  ClientSideOnlyDocumentElement,
  KeystarProvider,
} from '@keystar/ui/core';

export default function FrameComponent({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <KeystarProvider>
      <ClientSideOnlyDocumentElement />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </KeystarProvider>
  );
}
