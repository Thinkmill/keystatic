import rangeParser from 'parse-numeric-range';
import PrismHighlight, { Language, Prism } from 'prism-react-renderer';

import { Box } from '@keystar/ui/layout';

import { usePrismTheme } from './prism-theme';

import type { JSX } from 'react';

interface HighlightProps {
  code: string;
  language: string;
  emphasis?: string;
}

['js', 'jsx', 'ts', 'tsx'].forEach(lang => {
  // @ts-expect-error: Property 'insertBefore' does not exist on type 'LanguageDict'.
  Prism.languages.insertBefore(lang, 'template-string', {
    'gql-template-string': {
      pattern: /gql`[^`]*`/,
      inside: Prism.languages.graphql,
    },
  });
});

const getShouldHighlightLine = (highlightRange = '') => {
  if (/^[\d,-]+$/.test(highlightRange)) {
    const lineNumbers = rangeParser(highlightRange);
    return (index: number) => lineNumbers.includes(index + 1);
  } else {
    return () => false;
  }
};

function isLanguage(language: string): language is Language {
  return language in Prism.languages;
}

export function Highlight({
  code,
  language,
  emphasis,
}: HighlightProps): JSX.Element {
  const theme = usePrismTheme();
  const shouldHighlightLine = getShouldHighlightLine(emphasis);
  return (
    <PrismHighlight
      Prism={Prism}
      theme={theme}
      code={code}
      language={isLanguage(language) ? language : 'tsx'}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <Box elementType="code" minWidth="100%">
          {tokens.map((line, i) => {
            return (
              <div
                {...getLineProps({ line, key: i })}
                key={i}
                style={{
                  backgroundColor: shouldHighlightLine(i)
                    ? 'rgba(0,0,0,0.05)'
                    : undefined,
                }}
              >
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} key={key} />
                ))}
              </div>
            );
          })}
        </Box>
      )}
    </PrismHighlight>
  );
}
