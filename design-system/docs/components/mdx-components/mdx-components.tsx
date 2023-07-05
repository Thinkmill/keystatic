import { ReactNode, ElementType } from 'react';

import { Divider } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { Text } from '@keystar/ui/typography';

import { Heading } from '../../components/content/toc-context';
import { InlineCode } from '../example-helpers';
import { CodeBlock } from './code-block';
import { MdxTable, MdxTd, MdxTh, MdxThead, MdxTr } from './mdx-table';
import { ReactLive } from './react-live';
import {
  Article,
  BlockQuote,
  ListItem,
  ol,
  ul,
} from './client-markdoc-components';

export const mdxComponents: Record<string, ElementType> = {
  // Native HTML elements
  article: Article,
  a: props => (
    <TextLink
      prominence={props.href.startsWith('http') ? 'high' : undefined}
      {...props}
    />
  ),
  p: props => {
    return <Text elementType="p" size="medium" {...props} />;
  },
  blockquote: BlockQuote,
  Heading: (props: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children: ReactNode;
    id: string;
  }) => {
    const { children, id, level } = props;
    const levelToSize = ['large', 'medium', 'regular', 'small'] as const;
    const size = levelToSize[level - 1] ?? 'small';
    return (
      <Heading id={id} size={size} elementType={`h${level}`}>
        {children}
      </Heading>
    );
  },
  hr: () => <Divider size="large" marginTop="xlarge" />,
  ul,
  ol,
  li: ListItem,
  table: MdxTable,
  thead: MdxThead,
  tr: MdxTr,
  th: MdxTh,
  td: MdxTd,
  code: InlineCode,
  CodeBlock,
  LiveCode: ReactLive,
};
