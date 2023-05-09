import { ReactNode } from 'react';

type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
};
type ValidHeading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export default function Heading({ level, children }: HeadingProps) {
  const Tag: ValidHeading = `h${level}`;
  let textClasses = 'text-3xl font-bold';
  switch (level) {
    case 2:
      textClasses = 'text-2xl font-bold';
      break;
    case 3:
      textClasses = 'text-xl font-bold';
      break;
    case 4:
      textClasses = 'text-lg font-bold';
      break;
    case 5:
    case 6:
      textClasses = 'text-lg';
      break;
  }
  return <Tag className={textClasses}>{children}</Tag>;
}
