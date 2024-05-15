/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { EditorStateDescription, jsx, toEditorState } from './utils';
import { createEditorSchema } from '../schema';
import { editorOptionsToConfig } from '../../config';
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { proseMirrorToMDXRoot } from '../mdx/serialize';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxjs } from 'micromark-extension-mdxjs';
import { mdxToProseMirror } from '../mdx/parse';
import { expect, test } from '@jest/globals';
import { block, inline, mark } from '../../../../../content-components';
import { fields } from '../../../../..';
import { gfm } from 'micromark-extension-gfm';

const schema = createEditorSchema(
  editorOptionsToConfig({}),
  {
    Something: block({
      label: 'Something',
      schema: {
        bool: fields.checkbox({ label: 'Bool' }),
      },
    }),
    Another: block({
      label: 'Another',
      schema: {
        array: fields.array(
          fields.object({
            blah: fields.text({ label: 'Blah' }),
          })
        ),
      },
    }),
    Highlight: mark({
      label: 'Highlight',
      icon: undefined!,
      className: 'highlight',
      schema: {
        variant: fields.select({
          label: 'Variant',
          options: [
            { value: 'default', label: 'Default' },
            { value: 'success', label: 'Success' },
            { value: 'warning', label: 'Warning' },
            { value: 'danger', label: 'Danger' },
          ],
          defaultValue: 'default',
        }),
      },
    }),
    InlineThing: inline({
      label: 'Inline Thing',
      schema: {
        something: fields.text({ label: 'Something' }),
      },
    }),
  },
  true
);

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
    extensions: [mdxjs(), gfm()],
    mdastExtensions: [mdxFromMarkdown(), gfmFromMarkdown()],
  });
  const files = new Map<string, Uint8Array>([
    ['something something.png', new Uint8Array([])],
  ]);
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

test('image with space in src', () => {
  const mdx = `![something](something%20something.png)`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <image
          alt="something"
          filename="something something.png"
          src={Uint8Array []}
          title={null}
        />
      </paragraph>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "![something](something%20something.png)
    "
  `);
});

test('array in component', () => {
  const mdx = `<Another array={[{blah:'A'},{blah:'B'}]} />`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <node_selection>
        <Another
          props={
            {
              "extraFiles": [],
              "value": {
                "array": [
                  {
                    "blah": "A",
                  },
                  {
                    "blah": "B",
                  },
                ],
              },
            }
          }
        />
      </node_selection>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "<Another array={[{"blah":"A"},{"blah":"B"}]} />
    "
  `);
});

test('mark', () => {
  const mdx = `<Highlight variant="success">something</Highlight>`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text
          Highlight={
            {
              "props": {
                "extraFiles": [],
                "value": {
                  "variant": "success",
                },
              },
            }
          }
        >
          <cursor />
          something
        </text>
      </paragraph>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "<Highlight variant="success">something</Highlight>
    "
  `);
});

test('mark 2', () => {
  const mdx = `<Highlight variant="warning">something</Highlight>`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text
          Highlight={
            {
              "props": {
                "extraFiles": [],
                "value": {
                  "variant": "warning",
                },
              },
            }
          }
        >
          <cursor />
          something
        </text>
      </paragraph>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "<Highlight variant="warning">something</Highlight>
    "
  `);
});

test('inline', () => {
  const mdx = `wertgrfdsc<InlineThing something="adkjsakjndnajksdnjk" />asdfasdf`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          <cursor />
          wertgrfdsc
        </text>
        <InlineThing
          props={
            {
              "extraFiles": [],
              "value": {
                "something": "adkjsakjndnajksdnjk",
              },
            }
          }
        />
        <text>
          asdfasdf
        </text>
      </paragraph>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "wertgrfdsc<InlineThing something="adkjsakjndnajksdnjk" />asdfasdf
    "
  `);
});

test('hard break with two spaces', () => {
  const mdx = `something  
something else`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          <cursor />
          something
        </text>
        <hard_break />
        <text>
          something else
        </text>
      </paragraph>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "something\\
    something else
    "
  `);
});

test('hard break with escape', () => {
  const mdx = `something\\
something else`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          <cursor />
          something
        </text>
        <hard_break />
        <text>
          something else
        </text>
      </paragraph>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "something\\
    something else
    "
  `);
});

test('link reference', () => {
  const mdx = `[a][b]
  
[b]: https://keystatic.com
`;
  const editor = fromMDX(mdx);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text
          link={
            {
              "href": "https://keystatic.com",
              "title": "",
            }
          }
        >
          <cursor />
          a
        </text>
      </paragraph>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "[a](https://keystatic.com)
    "
  `);
});

test('two hard breaks', () => {
  const editor = fromMDX('something\\\n\\\nThe');
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          <cursor />
          something
        </text>
        <hard_break />
        <hard_break />
        <text>
          The
        </text>
      </paragraph>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "something\\
    \\
    The
    "
  `);
});

test('table', () => {
  const editor = fromMDX(`
a

| a | b | c |
| - | - | - |
| d | e | f |
| g | h | i |

b
`);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          <cursor />
          a
        </text>
      </paragraph>
      <table>
        <table_row>
          <table_cell
            colspan={1}
            rowspan={1}
          >
            <paragraph>
              <text>
                a
              </text>
            </paragraph>
          </table_cell>
          <table_cell
            colspan={1}
            rowspan={1}
          >
            <paragraph>
              <text>
                b
              </text>
            </paragraph>
          </table_cell>
          <table_cell
            colspan={1}
            rowspan={1}
          >
            <paragraph>
              <text>
                c
              </text>
            </paragraph>
          </table_cell>
        </table_row>
        <table_row>
          <table_cell
            colspan={1}
            rowspan={1}
          >
            <paragraph>
              <text>
                d
              </text>
            </paragraph>
          </table_cell>
          <table_cell
            colspan={1}
            rowspan={1}
          >
            <paragraph>
              <text>
                e
              </text>
            </paragraph>
          </table_cell>
          <table_cell
            colspan={1}
            rowspan={1}
          >
            <paragraph>
              <text>
                f
              </text>
            </paragraph>
          </table_cell>
        </table_row>
        <table_row>
          <table_cell
            colspan={1}
            rowspan={1}
          >
            <paragraph>
              <text>
                g
              </text>
            </paragraph>
          </table_cell>
          <table_cell
            colspan={1}
            rowspan={1}
          >
            <paragraph>
              <text>
                h
              </text>
            </paragraph>
          </table_cell>
          <table_cell
            colspan={1}
            rowspan={1}
          >
            <paragraph>
              <text>
                i
              </text>
            </paragraph>
          </table_cell>
        </table_row>
      </table>
      <paragraph>
        <text>
          b
        </text>
      </paragraph>
    </doc>
  `);
  expect(toMDX(editor)).toMatchInlineSnapshot(`
    "a

    | a | b | c |
    | - | - | - |
    | d | e | f |
    | g | h | i |

    b
    "
  `);
});

test('undefined component', () => {
  expect(() => {
    fromMDX('<ComponentThatDoesNotExist />');
  }).toThrowErrorMatchingInlineSnapshot(
    `"Missing component definition for ComponentThatDoesNotExist"`
  );
});

test('other syntax', () => {
  expect(() => {
    fromMDX('export const a = true;');
  }).toThrowErrorMatchingInlineSnapshot(`
    "Unhandled type mdxjsEsm: export const a = true;
    "
  `);
});
