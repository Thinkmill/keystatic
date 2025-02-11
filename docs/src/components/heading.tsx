import slugify from '@sindresorhus/slugify';
import { ReactNode } from 'react';
import { LinkIcon } from '@heroicons/react/24/outline';
import { cx } from '../utils';

type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  anchor?: boolean;
};
type ValidHeading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export default function Heading({ level, children, anchor }: HeadingProps) {
  const Tag: ValidHeading = `h${level}`;
  let textClasses = 'text-2xl sm:text-3xl font-extrabold';
  switch (level) {
    case 2:
      textClasses = 'text-xl sm:text-2xl font-bold';
      break;
    case 3:
      textClasses = 'text-lg sm:text-xl font-bold';
      break;
    case 4:
      textClasses = 'text-md sm:text-lg font-bold';
      break;
    case 5:
    case 6:
      textClasses = 'text-sm sm:text-md';
      break;
  }

  if (anchor) {
    const slug = getSlug(children);
    return (
      <a
        id={slug}
        href={`#${slug}`}
        /* scrollMarginTop: 3rem (header padding) + 3rem (header content) + 1rem (top margin) */
        className="group relative mt-6 scroll-mt-[7rem] first:mt-0 peer-adjacent:mt-0"
      >
        <LinkIcon className="absolute -ml-5 mt-2 hidden h-4 w-8 pr-4 group-hover:inline" />
        <Tag className={textClasses}>{children}</Tag>
      </a>
    );
  }

  return (
    <Tag className={cx(textClasses, 'mt-6 first:mt-0 peer-adjacent:mt-0')}>
      {children}
    </Tag>
  );
}

const getSlug = (node: ReactNode) => slugify(getTextNode(node));

const getTextNode = (node: ReactNode): string => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  // Node object expected for Headings
  if (
    typeof node === 'object' &&
    'text' in node &&
    typeof node.text === 'string'
  ) {
    return node.text;
  }
  if (node instanceof Array) return node.map(getTextNode).join('');
  if (
    typeof node === 'object' &&
    'props' in node &&
    typeof node.props === 'object' &&
    node.props !== null &&
    'node' in node.props
  ) {
    return getTextNode(node.props.node as ReactNode);
  }
  return '';
};
