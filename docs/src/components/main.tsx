import { HTMLAttributes, ReactNode } from 'react';
import { H1_ID } from '../constants';

type MainProps = {
  children: ReactNode;
  className?: string;
} & Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'className' | 'tabIndex' | 'aria-labelledby'
>;

export const Main = ({ children, className, ...props }: MainProps) => (
  <main
    className={`outline-0 ${className || ''}`}
    tabIndex={-1}
    aria-labelledby={H1_ID}
    {...props}
  >
    {children}
  </main>
);
