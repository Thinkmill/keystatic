import { ReactNode } from 'react';

type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
};

type ValidHeading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export function Heading({ level, children }: HeadingProps) {
  const Tag: ValidHeading = `h${level}`;
  return <Tag className="first:mt-0">{children}</Tag>;
}
