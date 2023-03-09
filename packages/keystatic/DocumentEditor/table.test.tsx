/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { Node, Transforms } from 'slate';
import { cellActions, insertTable } from './table';
import { jsx, makeEditor } from './tests/utils';

const table = (
  options: Parameters<typeof makeEditor>[1] | Node[],
  ...rows: Node[][]
) =>
  makeEditor(
    <editor>
      <table>
        <table-body>
          {[...(Array.isArray(options) ? [options] : []), ...rows].map(row => (
            <table-row>{row}</table-row>
          ))}
        </table-body>
      </table>
      <paragraph>
        <text />
      </paragraph>
    </editor>,
    Array.isArray(options) ? undefined : options
  );

const cell = (content: string | Node) => (
  <table-cell>
    <paragraph>
      {typeof content === 'string' ? <text>{content}</text> : content}
    </paragraph>
  </table-cell>
);

const cellWithCursor = (content: string) =>
  cell(
    <text>
      <cursor />
      {content}
    </text>
  );

const cellWithAnchor = (content: string) =>
  cell(
    <text>
      <anchor />
      {content}
    </text>
  );

const cellWithFocus = (content: string) =>
  cell(
    <text>
      <focus />
      {content}
    </text>
  );

test('delete at start does nothing', () => {
  let editor = table([cellWithCursor('some content')]);
  const initialEditor = makeEditor(editor);
  editor.deleteBackward('character');
  expect(editor).toEqualEditor(initialEditor);
});

// eslint-disable-next-line jest/no-disabled-tests
test.skip('delete in second cell does nothing', () => {
  let editor = table([cell('1a'), cellWithCursor('1b')]);
  const initialEditor = makeEditor(editor);
  editor.deleteBackward('character');
  expect(editor).toEqualEditor(initialEditor);
});

test('insert row below', () => {
  let editor = table([cell('1a'), cellWithCursor('1b')]);
  cellActions.insertRowBelow.action(editor, [0, 0, 0, 0]);
  expect(editor).toEqualEditor(
    table([cell('1a'), cell('1b')], [cellWithCursor(''), cell('')])
  );
});

test('insert column right', () => {
  let editor = table([cell('1a'), cellWithCursor('1b')]);
  cellActions.insertColumnRight.action(editor, [0, 0, 0, 0]);
  expect(editor).toEqualEditor(
    table([cell('1a'), cellWithCursor(''), cell('1b')])
  );
});
test('insert column and row', () => {
  let editor = table([cell('1a'), cellWithCursor('1b')]);
  cellActions.insertRowBelow.action(editor, [0, 0, 0, 0]);
  cellActions.insertColumnRight.action(editor, [0, 0, 0, 0]);
  expect(editor).toEqualEditor(
    table(
      [cell('1a'), cellWithCursor(''), cell('1b')],
      [cell(''), cell(''), cell('')]
    )
  );
});

test('delete row', () => {
  const editor = table(
    [cell('1a'), cellWithCursor('1b'), cell('1c')],
    [cell('2a'), cell('2b'), cell('2c')],
    [cell('3a'), cell('3b'), cell('3c')]
  );
  cellActions.deleteRow.action(editor, [0, 0, 2, 1]);
  expect(editor).toEqualEditor(
    table(
      [cell('1a'), cellWithCursor('1b'), cell('1c')],
      [cell('2a'), cell('2b'), cell('2c')]
    )
  );
});

test('delete column', () => {
  const editor = table(
    [cell('1a'), cellWithCursor('1b'), cell('1c')],
    [cell('2a'), cell('2b'), cell('2c')],
    [cell('3a'), cell('3b'), cell('3c')]
  );
  cellActions.deleteColumn.action(editor, [0, 0, 2, 1]);
  expect(editor).toEqualEditor(
    table(
      [cell('1a'), cellWithCursor('1c')],
      [cell('2a'), cell('2c')],
      [cell('3a'), cell('3c')]
    )
  );
});

test('normalize to the same number of cells in a row', () => {
  const editor = table(
    { normalization: 'normalize' },
    [cell('1a'), cell('1b'), cell('1c')],
    [cell('2a'), cell('2b')],
    [cell('3a'), cell('3b'), cell('3c')]
  );
  expect(editor).toEqualEditor(
    table(
      [cell('1a'), cell('1b'), cell('1c')],
      [cell('2a'), cell('2b'), cell('')],
      [cell('3a'), cell('3b'), cell('3c')]
    )
  );
});

test('delete whole table', () => {
  const editor = table(
    [cellWithAnchor('1a'), cell('1b'), cell('1c')],
    [cell('2a'), cell('2b'), cell('2c')],
    [cell('3a'), cell('3b'), cellWithFocus('3c')]
  );
  editor.deleteFragment();
  expect(editor).toEqualEditor(
    makeEditor(
      <editor>
        <paragraph>
          <text>
            <cursor />
          </text>
        </paragraph>
      </editor>
    )
  );
});

test('delete rows', () => {
  const editor = table(
    [cell('1a'), cell('1b'), cell('1c')],
    [cellWithAnchor('2a'), cell('2b'), cell('2c')],
    [cell('3a'), cell('3b'), cellWithFocus('3c')]
  );
  editor.deleteFragment();
  expect(editor).toEqualEditor(
    table([
      cell('1a'),
      cell('1b'),
      cell(
        <text>
          1c
          <cursor />
        </text>
      ),
    ])
  );
});

test('delete middle column', () => {
  const editor = table(
    [cell('1a'), cellWithAnchor('1b'), cell('1c')],
    [cell('2a'), cell('2b'), cell('2c')],
    [cell('3a'), cellWithFocus('3b'), cell('3c')]
  );
  editor.deleteFragment();
  expect(editor).toEqualEditor(
    table(
      [cellWithCursor('1a'), cell('1c')],
      [cell('2a'), cell('2c')],
      [cell('3a'), cell('3c')]
    )
  );
});

test('delete first column', () => {
  const editor = table(
    [cellWithAnchor('1a'), cell('1b'), cell('1c')],
    [cell('2a'), cell('2b'), cell('2c')],
    [cellWithFocus('3a'), cell('3b'), cell('3c')]
  );
  editor.deleteFragment();
  expect(editor).toEqualEditor(
    table(
      [cellWithCursor('1b'), cell('1c')],
      [cell('2b'), cell('2c')],
      [cell('3b'), cell('3c')]
    )
  );
});

test('delete last column', () => {
  const editor = table(
    [cell('1a'), cell('1b'), cellWithAnchor('1c')],
    [cell('2a'), cell('2b'), cell('2c')],
    [cell('3a'), cell('3b'), cellWithFocus('3c')]
  );
  editor.deleteFragment();
  expect(editor).toEqualEditor(
    table(
      [cell('1a'), cellWithCursor('1b')],
      [cell('2a'), cell('2b')],
      [cell('3a'), cell('3b')]
    )
  );
});

test('delete two columns', () => {
  const editor = table(
    [cell('1a'), cellWithAnchor('1b'), cell('1c')],
    [cell('2a'), cell('2b'), cell('2c')],
    [cell('3a'), cell('3b'), cellWithFocus('3c')]
  );
  editor.deleteFragment();
  expect(editor).toEqualEditor(
    table([cellWithCursor('1a')], [cell('2a')], [cell('3a')])
  );
});

test('clear cells', () => {
  const editor = table(
    [cell('1a'), cell('1b'), cell('1c')],
    [cell('2a'), cellWithAnchor('2b'), cell('2c')],
    [cell('3a'), cell('3b'), cellWithFocus('3c')]
  );
  editor.deleteFragment();
  expect(editor).toEqualEditor(
    table(
      [cell('1a'), cell('1b'), cell('1c')],
      [cell('2a'), cellWithCursor(''), cell('')],
      [cell('3a'), cell(''), cell('')]
    )
  );
});

test('clear cells with multiple children in cell', () => {
  const editor = table(
    [cell('1a'), cell('1b'), cell('1c')],
    [
      cell('2a'),
      cellWithAnchor('2b'),
      <table-cell>
        <paragraph>
          <text>a</text>
        </paragraph>
        <paragraph>
          <text>b</text>
        </paragraph>
      </table-cell>,
    ],
    [cell('3a'), cell('3b'), cellWithFocus('3c')]
  );
  editor.deleteFragment();
  expect(editor).toEqualEditor(
    table(
      [cell('1a'), cell('1b'), cell('1c')],
      [cell('2a'), cellWithCursor(''), cell('')],
      [cell('3a'), cell(''), cell('')]
    )
  );
});

test('insert table', () => {
  const editor = makeEditor(
    <editor>
      <paragraph>
        <text>
          <cursor />
        </text>
      </paragraph>
    </editor>
  );
  insertTable(editor);
  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <paragraph>
        <text />
      </paragraph>
      <table>
        <table-head>
          <table-row>
            <table-cell
              header={true}
            >
              <paragraph>
                <text />
              </paragraph>
            </table-cell>
            <table-cell
              header={true}
            >
              <paragraph>
                <text />
              </paragraph>
            </table-cell>
            <table-cell
              header={true}
            >
              <paragraph>
                <text />
              </paragraph>
            </table-cell>
          </table-row>
        </table-head>
        <table-body>
          <table-row>
            <table-cell>
              <paragraph>
                <text />
              </paragraph>
            </table-cell>
            <table-cell>
              <paragraph>
                <text />
              </paragraph>
            </table-cell>
            <table-cell>
              <paragraph>
                <text />
              </paragraph>
            </table-cell>
          </table-row>
          <table-row>
            <table-cell>
              <paragraph>
                <text />
              </paragraph>
            </table-cell>
            <table-cell>
              <paragraph>
                <text />
              </paragraph>
            </table-cell>
            <table-cell>
              <paragraph>
                <text>
                  <cursor />
                </text>
              </paragraph>
            </table-cell>
          </table-row>
        </table-body>
      </table>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

test('copy paste with expanded selection', () => {
  const editor = table(
    [cell(''), cell(''), cell('1a'), cell('1b'), cell('1c')],
    [cell(''), cell(''), cell('2a'), cellWithAnchor('2b'), cell('2c')],
    [cell(''), cell(''), cell('3a'), cell('3b'), cellWithFocus('3c')]
  );
  const fragment = editor.getFragment();
  Transforms.setSelection(editor, {
    anchor: { path: [0, 0, 0, 0, 0, 0], offset: 0 },
    focus: { path: [0, 0, 1, 1, 0, 0], offset: 0 },
  });
  editor.insertFragment(fragment);
  expect(editor).toEqualEditor(
    table(
      [cellWithAnchor('2b'), cell('2c'), cell('1a'), cell('1b'), cell('1c')],
      [
        cell('3b'),
        cell(
          <text>
            3c
            <focus />
          </text>
        ),
        cell('2a'),
        cell('2b'),
        cell('2c'),
      ],
      [cell(''), cell(''), cell('3a'), cell('3b'), cell('3c')]
    )
  );
});

test('copy paste with collapsed selection', () => {
  const editor = table(
    [cell(''), cell(''), cell('1a'), cell('1b'), cell('1c')],
    [cell(''), cell(''), cell('2a'), cellWithAnchor('2b'), cell('2c')],
    [cell(''), cell(''), cell('3a'), cell('3b'), cellWithFocus('3c')]
  );
  const fragment = editor.getFragment();
  Transforms.select(editor, [0, 0, 0, 0, 0, 0]);
  editor.insertFragment(fragment);
  expect(editor).toEqualEditor(
    table(
      [cellWithAnchor('2b'), cell('2c'), cell('1a'), cell('1b'), cell('1c')],
      [
        cell('3b'),
        cell(
          <text>
            3c
            <focus />
          </text>
        ),
        cell('2a'),
        cell('2b'),
        cell('2c'),
      ],
      [cell(''), cell(''), cell('3a'), cell('3b'), cell('3c')]
    )
  );
});
