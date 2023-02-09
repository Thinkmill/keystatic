import {
  ReactNode,
  ElementType,
  HTMLAttributes,
  createContext,
  useContext,
} from 'react';

import { Box, Divider, Flex } from '@voussoir/layout';
import { TextLink } from '@voussoir/link';
import { css, tokenSchema } from '@voussoir/style';
import { Text } from '@voussoir/typography';

import { Heading } from '../../components/content/toc-context';
import { InlineCode } from '../example-helpers';
import { CodeBlock } from './code-block';
import { MdxTable, MdxTd, MdxTh, MdxThead, MdxTr } from './mdx-table';
import { ReactLive } from './react-live';

export const mdxComponents: Record<string, ElementType> = {
  // Native HTML elements
  article: (props: { children: ReactNode }) => {
    return (
      <Flex
        direction="column"
        elementType="article"
        gap="xlarge"
        UNSAFE_className={css({
          '& > h2, & > h3, & > h4': {
            marginTop: '1.5em',
            scrollMarginTop: tokenSchema.size.space.xlarge,
          },
        })}
      >
        {props.children}
      </Flex>
    );
  },
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
  ul: getList('ul'),
  ol: getList('ol'),
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

// Styled components
// ----------------------------------------------------------------------------

function BlockQuote(props: HTMLAttributes<HTMLQuoteElement>) {
  return (
    <Box
      paddingStart="xlarge"
      elementType="blockquote"
      position="relative"
      UNSAFE_className={css({
        color: tokenSchema.color.foreground.neutralSecondary,
        // fontSize: tokenSchema.fontsize.text.regular.size,
        p: { color: 'inherit', fontSize: 'inherit' },
        '&::before': {
          color: tokenSchema.color.background.accent,
          pointerEvents: 'none',
          userSelect: 'none',
          content: '"\\201C"',
          fontSize: '7em',
          insetBlockStart: 0,
          insetInlineStart: 0,
          lineHeight: 1,
          position: 'absolute',
          transform: 'translate(-55%, -20%)',
          zIndex: -1,
        },
      })}
      {...props}
    />
  );
}

export const listCounter = 'ksv-ol-counter';
type ListType = 'ul' | 'ol';
const ListContext = createContext<ListType>('ul');
function getList(type: ListType) {
  return function List(props: HTMLAttributes<HTMLUListElement>) {
    return (
      <ListContext.Provider value={type}>
        <Flex
          direction="column"
          gap="large"
          paddingStart="large"
          elementType={type}
          UNSAFE_className={css({
            counterReset: listCounter,
          })}
          {...props}
        />
      </ListContext.Provider>
    );
  };
}

function ListItem(props: Omit<HTMLAttributes<HTMLLIElement>, 'color'>) {
  const type = useContext(ListContext);
  const className =
    type === 'ol'
      ? css({
          color: tokenSchema.color.foreground.neutral,
          fontSize: tokenSchema.fontsize.text.medium.size,
          '::before': {
            content: `counter(${listCounter}) "."`,
            counterIncrement: listCounter,
          },
        })
      : undefined;
  const bullet =
    type === 'ol' ? null : (
      <Text size="small" color="neutral">
        •
      </Text>
    );

  return (
    <Flex gap="small" elementType="li">
      <Flex
        aria-hidden="true"
        alignItems="center"
        flexShrink={0}
        height={tokenSchema.fontsize.text.medium.capheight}
        justifyContent={type === 'ul' ? 'center' : 'start'}
        userSelect="none"
        width="1em"
        UNSAFE_className={className}
      >
        {bullet}
      </Flex>
      <Text size="medium" {...props} />
    </Flex>
  );
}
