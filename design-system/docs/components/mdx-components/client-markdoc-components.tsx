'use client';
import { Box, Flex } from '@keystar/ui/layout';
import { css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { ReactNode, createContext, HTMLAttributes, useContext } from 'react';

export function Article(props: { children: ReactNode }) {
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
}

export const listCounter = 'docs-ol-counter';
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

export const ul = getList('ul');
export const ol = getList('ol');

export function ListItem(props: Omit<HTMLAttributes<HTMLLIElement>, 'color'>) {
  const type = useContext(ListContext);
  const commonStyles = {
    height: tokenSchema.typography.text.medium.capheight,
    width: '1em',
  };
  const className =
    type === 'ol'
      ? css({
          ...commonStyles,
          color: tokenSchema.color.foreground.neutral,
          fontSize: tokenSchema.typography.text.medium.size,
          '::before': {
            content: `counter(${listCounter}) "."`,
            counterIncrement: listCounter,
          },
        })
      : css(commonStyles);
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
        justifyContent={type === 'ul' ? 'center' : 'start'}
        userSelect="none"
        UNSAFE_className={className}
      >
        {bullet}
      </Flex>
      <Text size="medium" {...props} />
    </Flex>
  );
}

export function BlockQuote(props: HTMLAttributes<HTMLQuoteElement>) {
  return (
    <Box
      paddingStart="xlarge"
      elementType="blockquote"
      position="relative"
      UNSAFE_className={css({
        color: tokenSchema.color.foreground.neutralSecondary,
        // fontSize: tokenSchema.typography.text.regular.size,
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
