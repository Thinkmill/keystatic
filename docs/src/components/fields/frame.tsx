import { ReactNode } from 'react';
import { VoussoirProvider } from '@keystar/ui/core';

export function FieldDemoFrame({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <div className="my-2 rounded-lg bg-keystatic-gray-light px-6 py-6">
      <VoussoirProvider colorScheme="light" scale="medium">
        {children}
      </VoussoirProvider>
    </div>
  );
}
