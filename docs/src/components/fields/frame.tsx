import { ReactNode } from 'react';
import { VoussoirProvider } from '@keystar/ui/core';

export function FieldDemoFrame({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <div className="my-2 px-6 py-6 bg-keystatic-gray-light rounded-lg">
      <VoussoirProvider colorScheme="light" scale="medium">
        {children}
      </VoussoirProvider>
    </div>
  );
}
