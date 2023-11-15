'use client';
import { ReactNode } from 'react';

import { Box, Flex } from '@keystar/ui/layout';
import { FlexStyleProps, css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

// Inline code

export const InlineCode = ({ children }: { children: string }) => {
  return (
    <Box
      elementType="code"
      backgroundColor="accent"
      paddingX="xsmall"
      paddingY={2}
      borderRadius="small"
      UNSAFE_className={css({
        color: tokenSchema.color.foreground.neutralEmphasis,
        fontSize: '0.85em',
        fontFamily: tokenSchema.typography.fontFamily.code,
      })}
    >
      {children}
    </Box>
  );
};

// Placeholder element

type PlaceholderProps = {
  children?: ReactNode;
  represent?: 'image' | 'text';
  shape?: 'square' | 'round';
} & FlexStyleProps;

export const placeholderCounter = 'placeholder-counter';

export const Placeholder = ({
  children,
  represent = 'text',
  shape = 'square',
  ...flexStyleProps
}: PlaceholderProps) => {
  const svgStyles = css({
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
  });
  const lineStyles = css({
    stroke: tokenSchema.color.border.muted,
    strokeWidth: tokenSchema.size.border.regular,
  });
  const textStyles = children
    ? undefined
    : css({
        '::before': {
          content: `counter(${placeholderCounter})`,
          counterIncrement: placeholderCounter,
        },
      });

  const wrap = ['number', 'string', 'undefined'].includes(typeof children);
  const content = wrap ? (
    <Text
      align="center"
      trim={false}
      size="small"
      color="neutralSecondary"
      weight="medium"
      UNSAFE_className={textStyles}
    >
      {children}
    </Text>
  ) : (
    children
  );

  return (
    <Flex
      alignItems="center"
      backgroundColor="surface"
      border="neutral"
      borderRadius={shape === 'round' ? 'full' : undefined}
      flexShrink={0}
      justifyContent="center"
      overflow="hidden"
      position="relative"
      minHeight="element.small"
      minWidth="element.small"
      maxWidth="100%"
      {...flexStyleProps}
    >
      {represent === 'image' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className={svgStyles}>
          <line className={lineStyles} x1={0} y1={0} x2="100%" y2="100%" />
          <line className={lineStyles} x1="100%" y1={0} x2={0} y2="100%" />
        </svg>
      ) : (
        content
      )}
    </Flex>
  );
};
