/** @vitest-environment node */
import { ReactElement, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { DocumentRenderer } from './renderer';

function renderLink(
  href: string,
  link?: (props: { children: ReactNode; href: string }) => ReactElement | null
) {
  return renderToStaticMarkup(
    <DocumentRenderer
      document={[
        {
          type: 'paragraph',
          children: [{ type: 'link', href, children: [{ text: 'x' }] }],
        },
      ]}
      renderers={link ? { inline: { link } } : undefined}
    />
  );
}

test.each([
  'javascript:alert(1)',
  'JaVaScRiPt:alert(1)',
  '\tjavascript:alert(1)',
  'java\nscript:alert(1)',
  'data:text/html,<script>alert(1)</script>',
  'vbscript:msgbox(1)',
])('unsafe link href %j is replaced', href => {
  expect(renderLink(href)).toBe('<p><a href="about:blank">x</a></p>');
});

test.each([
  'https://example.com/a?b=c#d',
  'http://example.com',
  '/relative/path',
  '#heading',
  'mailto:someone@example.com',
])('safe link href %j is kept', href => {
  expect(renderLink(href)).toBe(`<p><a href="${href}">x</a></p>`);
});

test('custom link renderers receive the sanitized href', () => {
  const hrefs: string[] = [];
  renderLink('javascript:alert(1)', ({ children, href }) => {
    hrefs.push(href);
    return <>{children}</>;
  });
  expect(hrefs).toEqual(['about:blank']);
});
