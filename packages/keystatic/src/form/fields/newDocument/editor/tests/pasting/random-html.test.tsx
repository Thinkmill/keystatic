/** @jest-environment jsdom */

import { htmlToEditor } from './test-utils';

test('whitespace between blocks is removed', async () => {
  expect(await htmlToEditor('<p>blah</p>\n<span>   \n </span>    <p>other</p>'))
    .toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          blah
        </text>
      </paragraph>
      <paragraph>
        <text>
          other
          <cursor />
        </text>
      </paragraph>
    </doc>
  `);
});

test('inline elements containing only whitespace are preserved', async () => {
  expect(
    await htmlToEditor(
      '<p>blah<span> </span>more<span>\n</span>other</p>\n<span>   \n </span>    <p>other</p>'
    )
  ).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          blah more
    other
        </text>
      </paragraph>
      <paragraph>
        <text>
          other
          <cursor />
        </text>
      </paragraph>
    </doc>
  `);
});

test('a link around blocks turn into links around text', async () => {
  expect(
    await htmlToEditor(
      '<a href="https://keystonejs.com"><p>blah</p>\n<span>   \n </span> <h1>some heading</h1>   <p>other</p></a>'
    )
  ).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text />
        <link
          @@isInline={true}
          href="https://keystonejs.com"
        >
          <text>
            blah
          </text>
        </link>
        <text />
      </paragraph>
      <heading
        level={1}
      >
        <text />
        <link
          @@isInline={true}
          href="https://keystonejs.com"
        >
          <text>
            some heading
          </text>
        </link>
        <text />
      </heading>
      <paragraph>
        <text />
        <link
          @@isInline={true}
          href="https://keystonejs.com"
        >
          <text>
            other
          </text>
        </link>
        <text>
          <cursor />
        </text>
      </paragraph>
    </doc>
  `);
});

test('marks around blocks turn into marks around text', async () => {
  expect(
    await htmlToEditor(
      '<kbd><a href="https://keystonejs.com"><strong><p>blah</p>\n<span>   \n </span></strong> <em><h1>some heading</h1>   <p>other</p></em></a></kbd>'
    )
  ).toMatchInlineSnapshot(`
    <editor
      marks={
        {
          "italic": true,
          "keyboard": true,
        }
      }
    >
      <paragraph>
        <text />
        <link
          @@isInline={true}
          href="https://keystonejs.com"
        >
          <text
            bold={true}
            keyboard={true}
          >
            blah
          </text>
        </link>
        <text />
      </paragraph>
      <heading
        level={1}
      >
        <text />
        <link
          @@isInline={true}
          href="https://keystonejs.com"
        >
          <text
            italic={true}
            keyboard={true}
          >
            some heading
          </text>
        </link>
        <text />
      </heading>
      <paragraph>
        <text />
        <link
          @@isInline={true}
          href="https://keystonejs.com"
        >
          <text
            italic={true}
            keyboard={true}
          >
            other
          </text>
        </link>
        <text>
          <cursor />
        </text>
      </paragraph>
    </doc>
  `);
});

test('list items', async () => {
  expect(
    await htmlToEditor(
      '<ul><li>blah<strong> this is bold</strong><ul><li>inner</li></ul></li></ul>'
    )
  ).toMatchInlineSnapshot(`
    <doc>
      <unordered-list>
        <list-item>
          <list-item-content>
            <text>
              blah
            </text>
            <text
              bold={true}
            >
               this is bold
            </text>
          </list-item-content>
          <unordered-list>
            <list-item>
              <list-item-content>
                <text>
                  inner
                  <cursor />
                </text>
              </list-item-content>
            </list-item>
          </unordered-list>
        </list-item>
      </unordered-list>
      <paragraph>
        <text />
      </paragraph>
    </doc>
  `);
});

test('link, block and text as siblings', async () => {
  expect(
    await htmlToEditor(
      '<a href="https://keystonejs.com">Something</a><h1>a</h1>other'
    )
  ).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text />
        <link
          @@isInline={true}
          href="https://keystonejs.com"
        >
          <text>
            Something
          </text>
        </link>
        <text />
      </paragraph>
      <heading
        level={1}
      >
        <text>
          a
        </text>
      </heading>
      <paragraph>
        <text>
          other
          <cursor />
        </text>
      </paragraph>
    </doc>
  `);
});

test('inline code bit', async () => {
  const editor =
    await htmlToEditor(`<span>before<span> </span><code>Code</code><span> </span>end</span><div></div>
`);
  expect(editor).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          before 
        </text>
        <text
          code={true}
        >
          Code
        </text>
        <text>
          end
        </text>
      </paragraph>
      <paragraph>
        <text>
          <cursor />
        </text>
      </paragraph>
    </doc>
  `);
});
