/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { expect, test } from '@jest/globals';
import { Editor } from 'slate';
import { jsx, makeEditor } from '../tests/utils';

function insertCharsOneAtATime(editor: Editor, chars: string) {
  for (const char of chars) {
    editor.insertText(char);
  }
}

for (const type of ['space', 'enter'] as const) {
  const insert = (editor: Editor) => {
    if (type === 'space') {
      editor.insertText(' ');
    }
    if (type === 'enter') {
      editor.insertBreak();
    }
  };
  const makeInputEditor = () =>
    makeEditor(
      <editor>
        <paragraph>
          <text>
            <cursor />
          </text>
        </paragraph>
      </editor>
    );
  test(`inserting a code block with a shortcut ending with a ${type}`, () => {
    const editor = makeInputEditor();
    insertCharsOneAtATime(editor, '```');
    insert(editor);
    editor.insertText('some content');
    expect(editor).toEqualEditor(
      makeEditor(
        <editor>
          <code>
            <text>
              some content
              <cursor />
            </text>
          </code>
          <paragraph>
            <text />
          </paragraph>
        </editor>
      )
    );
  });
  test(`inserting a code block with a language a shortcut ending with a ${type}`, () => {
    const editor = makeInputEditor();
    insertCharsOneAtATime(editor, '```js');
    insert(editor);
    editor.insertText('some content');
    expect(editor).toEqualEditor(
      makeEditor(
        <editor>
          <code language="javascript">
            <text>
              some content
              <cursor />
            </text>
          </code>
          <paragraph>
            <text />
          </paragraph>
        </editor>
      )
    );
  });
  test(`inserting a code block with an unknown language a shortcut ending with a ${type}`, () => {
    const editor = makeInputEditor();
    insertCharsOneAtATime(editor, '```asdasdasdasdasdfasdfasdf');
    insert(editor);
    editor.insertText('some content');
    expect(editor).toEqualEditor(
      makeEditor(
        <editor>
          <code language="asdasdasdasdasdfasdfasdf">
            <text>
              some content
              <cursor />
            </text>
          </code>
          <paragraph>
            <text />
          </paragraph>
        </editor>
      )
    );
  });
}

test('insertBreak inserts a soft break', () => {
  let editor = makeEditor(
    <editor>
      <code>
        <text>
          {'asdkjnajsndakjndkjnaksdjn\nasdasdasd'}
          <cursor />
        </text>
      </code>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  );

  editor.insertBreak();

  editor.insertText('some text');

  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <code>
        <text>
          asdkjnajsndakjndkjnaksdjn
    asdasdasd
    some text
          <cursor />
        </text>
      </code>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

test('non-text is removed from code blocks', () => {
  let editor = makeEditor(
    <editor marks={{ bold: true }}>
      <code>
        <paragraph>
          <text bold>
            {'asdkjnajsndakjndkjnaksdjn\nasdasdasd\n'}
            <cursor />
          </text>
          <element type="inline-void">
            <text />
          </element>
          <divider>
            <text />
          </divider>
          <link href="something">
            <text>some thing</text>
          </link>
        </paragraph>
      </code>
      <paragraph>
        <text />
      </paragraph>
    </editor>,
    { normalization: 'skip' }
  );

  const { isVoid, isInline } = editor;
  editor.isVoid = element => {
    return (element as any).type === 'inline-void' || isVoid(element);
  };
  editor.isInline = element => {
    return (element as any).type === 'inline-void' || isInline(element);
  };

  Editor.normalize(editor, { force: true });

  expect(editor).toMatchInlineSnapshot(`
    <editor
      marks={
        {
          "bold": true,
        }
      }
    >
      <code>
        <text>
          asdkjnajsndakjndkjnaksdjn
    asdasdasd

          <cursor />
          some thing
        </text>
      </code>
      <divider
        @@isVoid={true}
      >
        <text />
      </divider>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

test('insertBreak when at end with \n as last character exits code block', () => {
  let editor = makeEditor(
    <editor>
      <code>
        <text>
          {'asdkjnajsndakjndkjnaksdjn\nasdasdasd\n'}
          <cursor />
        </text>
      </code>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  );

  editor.insertBreak();

  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <code>
        <text>
          asdkjnajsndakjndkjnaksdjn
    asdasdasd
        </text>
      </code>
      <paragraph>
        <text>
          <cursor />
        </text>
      </paragraph>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

test('insertBreak in the middle of the text when there is a break at the end of the text', () => {
  let editor = makeEditor(
    <editor>
      <code>
        <text>
          some text
          <cursor />
          {'more text\n'}
        </text>
      </code>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  );

  editor.insertBreak();
  expect((editor as any).children[0].children[0].text).toMatchInlineSnapshot(`
    "some text
    more text
    "
  `);
});
