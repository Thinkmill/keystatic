import type { JSX } from 'react';

export * from '../components/scope';

export function Render({
  children,
}: {
  children: () => JSX.Element;
}): JSX.Element {
  return children();
}
