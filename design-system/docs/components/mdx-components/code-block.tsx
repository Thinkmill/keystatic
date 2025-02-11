'use client';
import { Flex } from '@keystar/ui/layout';
import { css, tokenSchema } from '@keystar/ui/style';

import { Highlight } from './highlight';

import type { JSX } from 'react';

type CodeBlockProps = {
  language?: string;
  content: string;
  emphasis?: string;
};

export function CodeBlock({
  language,
  content,
  emphasis,
}: CodeBlockProps): JSX.Element {
  return (
    <Flex
      elementType="pre"
      backgroundColor="surface"
      borderRadius="medium"
      maxWidth="100%"
      overflow="auto"
      padding="medium"
      UNSAFE_className={css({
        color: tokenSchema.color.foreground.neutralEmphasis,
        fontFamily: tokenSchema.typography.fontFamily.code,
        fontSize: '0.85em',
        lineHeight: tokenSchema.typography.lineheight.medium,

        code: {
          fontFamily: 'inherit',
        },
      })}
    >
      <Highlight
        emphasis={emphasis}
        code={content}
        language={language || 'ts'}
      />
    </Flex>
  );
}
