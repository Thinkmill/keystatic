/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { EditorStateDescription, jsx, toEditorState } from './utils';
import { createEditorSchema } from '../schema';
import { editorOptionsToConfig } from '../../config';
import { gfmToMarkdown } from 'mdast-util-gfm';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { proseMirrorToMDXRoot } from '../mdx/serialize';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxjs } from 'micromark-extension-mdxjs';
import { mdxToProseMirror } from '../mdx/parse';
import { expect, test } from '@jest/globals';
import { block } from '../../../../../content-components';
import { fields } from '../../../../..';

const schema = createEditorSchema(editorOptionsToConfig({}), {
  Something: block({
    label: 'Something',
    schema: {
      bool: fields.checkbox({ label: 'Bool' }),
    },
  }),
});

function toMDX(node: EditorStateDescription) {
  const other = new Map<string, Uint8Array>();
  const external = new Map<string, Map<string, Uint8Array>>();
  const mdxNode = proseMirrorToMDXRoot(node.get().doc, {
    extraFiles: other,
    otherFiles: external,
    schema,
    slug: undefined,
  });
  return toMarkdown(mdxNode, {
    extensions: [gfmToMarkdown(), mdxToMarkdown()],
    rule: '-',
  });
}

function fromMDX(mdx: string) {
  const root = fromMarkdown(mdx, {
    extensions: [mdxjs()],
    mdastExtensions: [mdxFromMarkdown()],
  });
  const files = new Map<string, Uint8Array>();
  const otherFiles = new Map<string, Map<string, Uint8Array>>();
  const doc = mdxToProseMirror(root, schema, files, otherFiles, undefined);
  return toEditorState(doc);
}

test('basic', () => {
  expect(
    toMDX(
      <doc>
        <paragraph>
          <text>Something</text>
        </paragraph>
        <heading level={1}>
          <text>Heading</text>
        </heading>
        <paragraph />
      </doc>
    )
  ).toMatchInlineSnapshot(`
    "Something

    # Heading

    "
  `);
});

test('nested list', () => {
  const mdx = toMDX(
    <doc>
      <unordered_list>
        <list_item>
          <paragraph>
            <text>Something</text>
          </paragraph>
          <unordered_list>
            <list_item>
              <paragraph>
                <text>Something</text>
              </paragraph>
            </list_item>
          </unordered_list>
        </list_item>
      </unordered_list>
      <paragraph />
    </doc>
  );
  expect(mdx).toMatchInlineSnapshot(`
    "* Something

      * Something

    "
  `);
  expect(fromMDX(mdx)).toMatchInlineSnapshot(`
    <doc>
      <unordered_list>
        <list_item>
          <paragraph>
            <text>
              <cursor />
              Something
            </text>
          </paragraph>
          <unordered_list>
            <list_item>
              <paragraph>
                <text>
                  Something
                </text>
              </paragraph>
            </list_item>
          </unordered_list>
        </list_item>
      </unordered_list>
    </doc>
  `);
});

test('inline code', () => {
  const mdx = toMDX(
    <doc>
      <paragraph>
        <text>Something</text>
      </paragraph>
      <heading level={1}>
        <text>Heading</text>
      </heading>
      <paragraph>
        <text code>a</text>
      </paragraph>
    </doc>
  );
  expect(mdx).toMatchInlineSnapshot(`
    "Something

    # Heading

    \`a\`
    "
  `);
  expect(fromMDX(mdx)).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          <cursor />
          Something
        </text>
      </paragraph>
      <heading
        level={1}
        props={
          {
            "extraFiles": [],
            "value": {},
          }
        }
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
    </doc>
  `);
});

test('empty list item', () => {
  const mdx = `- a
- `;
  expect(fromMDX(mdx)).toMatchInlineSnapshot(`
    <doc>
      <unordered_list>
        <list_item>
          <paragraph>
            <text>
              <cursor />
              a
            </text>
          </paragraph>
        </list_item>
        <list_item>
          <paragraph />
        </list_item>
      </unordered_list>
    </doc>
  `);
});

test('link in code', () => {
  const mdx = `asdasdasd [\`something\`](https://keystatic.com)`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          <cursor />
          asdasdasd 
        </text>
        <text
          code={true}
          link={
            {
              "href": "https://keystatic.com",
              "title": "",
            }
          }
        >
          something
        </text>
      </paragraph>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "asdasdasd [\`something\`](https://keystatic.com)
    "
  `);
});

test('code and bold', () => {
  const mdx = `fgdsihjnegrkdfmsjknefrds **\`a\`** fgbdv`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          <cursor />
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
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "fgdsihjnegrkdfmsjknefrds **\`a\`** fgbdv
    "
  `);
});

test('link in list', () => {
  const mdx = `1. uses the Next.js [App router](https://nextjs.org/docs/app)
`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <ordered_list>
        <list_item>
          <paragraph>
            <text>
              <cursor />
              uses the Next.js 
            </text>
            <text
              link={
                {
                  "href": "https://nextjs.org/docs/app",
                  "title": "",
                }
              }
            >
              App router
            </text>
          </paragraph>
        </list_item>
      </ordered_list>
    </doc>
  `);
});

test('link in paragraph', () => {
  const mdx = `uses the Next.js [App router](https://nextjs.org/docs/app)`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          <cursor />
          uses the Next.js 
        </text>
        <text
          link={
            {
              "href": "https://nextjs.org/docs/app",
              "title": "",
            }
          }
        >
          App router
        </text>
      </paragraph>
    </doc>
  `);
});

test('code block with meta', () => {
  const mdx = `\`\`\`js blah
something
\`\`\`
`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <code_block
        language="js blah"
        props={
          {
            "extraFiles": [],
            "value": {},
          }
        }
      >
        <text>
          <cursor />
          something
        </text>
      </code_block>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "\`\`\`js blah
    something
    \`\`\`
    "
  `);
});

test('boolean shorthand', () => {
  const mdx = `<Something bool />`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <node_selection>
        <Something
          props={
            {
              "extraFiles": [],
              "value": {
                "bool": true,
              },
            }
          }
        />
      </node_selection>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "<Something bool />
    "
  `);
});
