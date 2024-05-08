/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { expect, test } from '@jest/globals';
import { jsx, makeEditor } from '../DocumentEditor/tests/utils';
import { component, fields } from '../../../api';
import { fromMarkdoc as _fromMarkdoc } from './from-markdoc';
import { toMarkdoc as _toMarkdoc } from './test-utils';
import { parse } from '#markdoc';
import { Node } from 'slate';

const componentBlocks = {
  'block-child': component({
    label: 'Block Child',
    preview: () => null,
    schema: {
      child: fields.child({ kind: 'block', placeholder: 'Content...' }),
    },
  }),
  'inline-child': component({
    label: 'Inline Child',
    preview: () => null,
    schema: {
      child: fields.child({ kind: 'inline', placeholder: 'Content...' }),
    },
  }),
  'related-links': component({
    label: 'Related Links',
    preview: () => null,
    schema: {
      links: fields.array(
        fields.object({
          heading: fields.text({ label: 'Heading' }),
          content: fields.child({ kind: 'inline', placeholder: 'Content...' }),
          href: fields.text({ label: 'Link' }),
        }),
        {
          asChildTag: 'related-link',
        }
      ),
    },
  }),
};

function toMarkdoc(node: Node) {
  return _toMarkdoc(node, componentBlocks);
}

function fromMarkdoc(markdoc: string) {
  return makeEditor(
    <editor>{_fromMarkdoc(parse(markdoc), componentBlocks)}</editor>,
    { normalization: 'normalize' }
  );
}

test('basic', () => {
  expect(
    toMarkdoc(
      <editor>
        <paragraph>
          <text>Something</text>
        </paragraph>
        <heading level={1}>
          <text>Heading</text>
        </heading>
        <paragraph>
          <text />
        </paragraph>
      </editor>
    )
  ).toMatchInlineSnapshot(`
    "Something

    # Heading
    "
  `);
});

test('nested list', () => {
  const markdoc = toMarkdoc(
    <editor>
      <unordered-list>
        <list-item>
          <list-item-content>
            <text>Something</text>
          </list-item-content>
          <unordered-list>
            <list-item>
              <list-item-content>
                <text>Something</text>
              </list-item-content>
            </list-item>
          </unordered-list>
        </list-item>
      </unordered-list>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  );
  expect(markdoc).toMatchInlineSnapshot(`
    "- Something
      - Something
    "
  `);
  expect(fromMarkdoc(markdoc)).toMatchInlineSnapshot(`
    <editor>
      <unordered-list>
        <list-item>
          <list-item-content>
            <text>
              Something
            </text>
          </list-item-content>
          <unordered-list>
            <list-item>
              <list-item-content>
                <text>
                  Something
                </text>
              </list-item-content>
            </list-item>
          </unordered-list>
        </list-item>
      </unordered-list>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

test('textAlign', () => {
  const markdoc = toMarkdoc(
    <editor>
      <paragraph textAlign="center">
        <text>Something</text>
      </paragraph>
      <heading level={1} textAlign="end">
        <text>Heading</text>
      </heading>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  );
  expect(markdoc).toMatchInlineSnapshot(`
    "Something{% textAlign="center" %}

    # Heading{% textAlign="end" %}
    "
  `);
  expect(fromMarkdoc(markdoc)).toMatchInlineSnapshot(`
    <editor>
      <paragraph
        textAlign="center"
      >
        <text>
          Something
        </text>
      </paragraph>
      <heading
        level={1}
        textAlign="end"
      >
        <text>
          Heading
        </text>
      </heading>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

test('inline code', () => {
  const markdoc = toMarkdoc(
    <editor>
      <paragraph>
        <text>Something</text>
      </paragraph>
      <heading level={1}>
        <text>Heading</text>
      </heading>
      <paragraph>
        <text code>a</text>
      </paragraph>
    </editor>
  );
  expect(markdoc).toMatchInlineSnapshot(`
    "Something

    # Heading

    \`a\`
    "
  `);
  expect(fromMarkdoc(markdoc)).toMatchInlineSnapshot(`
    <editor>
      <paragraph>
        <text>
          Something
        </text>
      </paragraph>
      <heading
        level={1}
      >
        <text>
          Heading
        </text>
      </heading>
      <paragraph>
        <text
          code={true}
        >
          a
        </text>
      </paragraph>
    </editor>
  `);
});
test('component block with block child', () => {
  expect(
    toMarkdoc(
      <editor>
        <component-block component="block-child" props={{ child: null }}>
          <component-block-prop propPath={['child']}>
            <paragraph>
              <text>Content</text>
            </paragraph>
          </component-block-prop>
        </component-block>
        <paragraph>
          <text />
        </paragraph>
      </editor>
    )
  ).toMatchInlineSnapshot(`
    "{% block-child %}
    Content
    {% /block-child %}
    "
  `);
});

test('component block with inline child', () => {
  expect(
    toMarkdoc(
      <editor>
        <component-block component="inline-child" props={{ child: null }}>
          <component-inline-prop propPath={['child']}>
            <text>Content</text>
          </component-inline-prop>
        </component-block>
        <paragraph>
          <text />
        </paragraph>
      </editor>
    )
  ).toMatchInlineSnapshot(`
    "{% inline-child %}Content{% /inline-child %}
    "
  `);
});

test('component block array with child field and data', () => {
  const markdoc = toMarkdoc(
    <editor>
      <component-block
        component="related-links"
        props={{
          links: [
            { heading: 'a', href: 'https://example.com/a', content: null },
            { heading: 'b', href: 'https://example.com/b', content: null },
            { heading: 'c', href: 'https://example.com/c', content: null },
          ],
        }}
      >
        <component-inline-prop propPath={['links', 0, 'content']}>
          <text>A content</text>
        </component-inline-prop>
        <component-inline-prop propPath={['links', 1, 'content']}>
          <text>B content</text>
        </component-inline-prop>
        <component-inline-prop propPath={['links', 2, 'content']}>
          <text>C content</text>
        </component-inline-prop>
      </component-block>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  );
  expect(markdoc).toMatchInlineSnapshot(`
    "{% related-links %}
    {% related-link heading="a" href="https://example.com/a" %}A content{% /related-link %}

    {% related-link heading="b" href="https://example.com/b" %}B content{% /related-link %}

    {% related-link heading="c" href="https://example.com/c" %}C content{% /related-link %}
    {% /related-links %}
    "
  `);
  expect(fromMarkdoc(markdoc)).toMatchInlineSnapshot(`
    <editor>
      <component-block
        component="related-links"
        props={
          {
            "links": [
              {
                "heading": "a",
                "href": "https://example.com/a",
              },
              {
                "heading": "b",
                "href": "https://example.com/b",
              },
              {
                "heading": "c",
                "href": "https://example.com/c",
              },
            ],
          }
        }
      >
        <component-inline-prop
          propPath={
            [
              "links",
              0,
              "content",
            ]
          }
        >
          <text>
            A content
          </text>
        </component-inline-prop>
        <component-inline-prop
          propPath={
            [
              "links",
              1,
              "content",
            ]
          }
        >
          <text>
            B content
          </text>
        </component-inline-prop>
        <component-inline-prop
          propPath={
            [
              "links",
              2,
              "content",
            ]
          }
        >
          <text>
            C content
          </text>
        </component-inline-prop>
      </component-block>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

test('array parsing', () => {
  const markdoc = `Something

{% related-links %}
{% related-link heading="something" href="https://example.com" %}some content{% /related-link %}
{% /related-links %}`;
  expect(fromMarkdoc(markdoc)).toMatchInlineSnapshot(`
    <editor>
      <paragraph>
        <text>
          Something
        </text>
      </paragraph>
      <component-block
        component="related-links"
        props={
          {
            "links": [
              {
                "heading": "something",
                "href": "https://example.com",
              },
            ],
          }
        }
      >
        <component-inline-prop
          propPath={
            [
              "links",
              0,
              "content",
            ]
          }
        >
          <text>
            some content
          </text>
        </component-inline-prop>
      </component-block>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

test('empty list item', () => {
  const markdoc = `- a
- `;
  expect(fromMarkdoc(markdoc)).toMatchInlineSnapshot(`
    <editor>
      <unordered-list>
        <list-item>
          <list-item-content>
            <text>
              a
            </text>
          </list-item-content>
        </list-item>
        <list-item>
          <list-item-content>
            <text />
          </list-item-content>
        </list-item>
      </unordered-list>
      <paragraph>
        <text />
      </paragraph>
    </editor>
    `);
});

test('link in code', () => {
  const markdoc = `asdasdasd [\`something\`](https://keystatic.com)`;
  const editor = fromMarkdoc(markdoc);
  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <paragraph>
        <text>
          asdasdasd 
        </text>
        <link
          @@isInline={true}
          href="https://keystatic.com"
        >
          <text
            code={true}
          >
            something
          </text>
        </link>
        <text />
      </paragraph>
    </editor>
  `);
  expect(toMarkdoc(editor)).toMatchInlineSnapshot(`
    "asdasdasd [\`something\`](https://keystatic.com)
    "
  `);
});

test('code and bold', () => {
  const markdoc = `fgdsihjnegrkdfmsjknefrds **\`a\`** fgbdv`;
  const editor = fromMarkdoc(markdoc);
  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <paragraph>
        <text>
          fgdsihjnegrkdfmsjknefrds 
        </text>
        <text
          bold={true}
          code={true}
        >
          a
        </text>
        <text>
           fgbdv
        </text>
      </paragraph>
    </editor>
  `);
  expect(toMarkdoc(editor)).toMatchInlineSnapshot(`
    "fgdsihjnegrkdfmsjknefrds **\`a\`** fgbdv
    "
  `);
});

test('italic in bold', () => {
  const markdoc = `**a *b* c**`;
  const editor = fromMarkdoc(markdoc);
  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <paragraph>
        <text
          bold={true}
        >
          a 
        </text>
        <text
          bold={true}
          italic={true}
        >
          b
        </text>
        <text
          bold={true}
        >
           c
        </text>
      </paragraph>
    </editor>
  `);
  expect(toMarkdoc(editor)).toMatchInlineSnapshot(`
    "**a** ***b*** **c**
    "
  `);
});

test('code and spaces', () => {
  const markdoc = `\`a\` \`b\``;
  const editor = fromMarkdoc(markdoc);
  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <paragraph>
        <text
          code={true}
        >
          a
        </text>
        <text>
           
        </text>
        <text
          code={true}
        >
          b
        </text>
      </paragraph>
    </editor>
  `);
  expect(toMarkdoc(editor)).toMatchInlineSnapshot(`
    "\`a\` \`b\`
    "
  `);
});

test('hard break with two spaces', () => {
  const markdoc = `something  
something else`;
  const editor = fromMarkdoc(markdoc);
  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <paragraph>
        <text>
          something
    something else
        </text>
      </paragraph>
    </editor>
  `);
  expect(toMarkdoc(editor)).toMatchInlineSnapshot(`
    "something\\
    something else
    "
  `);
});

test('hard break with escape', () => {
  const markdoc = `something\\
something else`;
  const editor = fromMarkdoc(markdoc);
  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <paragraph>
        <text>
          something
    something else
        </text>
      </paragraph>
    </editor>
  `);
  expect(toMarkdoc(editor)).toMatchInlineSnapshot(`
    "something\\
    something else
    "
  `);
});
