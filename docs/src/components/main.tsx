import { HTMLAttributes, ReactNode } from 'react';
import { H1_ID } from '../constants';

type MainProps = {
  children: ReactNode;
  className?: string;
  isFocusable?: boolean;
} & Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'className' | 'tabIndex' | 'aria-labelledby'
>;

export const Main = ({
  children,
  className,
  isFocusable = true,
  ...props
}: MainProps) => (
  <main
    className={`outline-none ${className || ''}`}
    aria-labelledby={H1_ID}
    {...(isFocusable && { tabIndex: -1 })}
    {...props}
  >
    {children}
  </main>
);
