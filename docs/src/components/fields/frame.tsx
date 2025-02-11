import { type JSX, ReactNode } from 'react';
import { KeystarProvider } from '@keystar/ui/core';

export function FieldDemoFrame({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <div className="my-2 rounded-lg bg-slate-3 px-6 py-6">
      <KeystarProvider colorScheme="light" scale="medium">
        {children}
      </KeystarProvider>
    </div>
  );
}
