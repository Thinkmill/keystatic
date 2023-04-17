import {
  Editor,
  Element,
  Node,
  Path,
  Transforms,
  Range,
  Text as SlateText,
  Descendant,
  Point,
} from 'slate';
import { moveChildren, nodeTypeMatcher } from '../utils';

function order(a: number, b: number) {
  return { start: Math.min(a, b), end: Math.max(a, b) };
}

export function getRelativeRowPath(hasHead: boolean, rowIndex: number): Path {
  return hasHead
    ? rowIndex === 0
      ? [0, 0]
      : [1, rowIndex - 1]
    : [0, rowIndex];
}

export function getSelectedTableArea(editor: Editor) {
  const anchor = Editor.above(editor, {
    match: nodeTypeMatcher('table-cell'),
    at: editor.selection?.anchor.path,
  })?.[1];
  const focus = Editor.above(editor, {
    match: nodeTypeMatcher('table-cell'),
    at: editor.selection?.focus.path,
  })?.[1];
  const table = Editor.above(editor, {
    match: nodeTypeMatcher('table'),
  });
  if (
    editor.selection &&
    table &&
    Element.isElement(table[0].children[0]) &&
    anchor &&
    focus &&
    Path.equals(anchor.slice(0, -3), focus.slice(0, -3))
  ) {
    const [start, end] = Editor.edges(editor, editor.selection);
    return {
      tablePath: table[1],
      table: table[0],
      singleCell: Path.equals(anchor, focus)
        ? Point.equals(Editor.start(editor, anchor), start) &&
          Point.equals(Editor.end(editor, anchor), end) &&
          !Point.equals(start, end)
          ? ('selected' as const)
          : ('not-selected' as const)
        : ('many' as const),
      row: order(
        anchor[anchor.length - 2] + anchor[anchor.length - 3],
        focus[focus.length - 2] + focus[anchor.length - 3]
      ),
      column: order(anchor[anchor.length - 1], focus[focus.length - 1]),
    };
  }
}

export const cell = (header: boolean) => ({
  type: 'table-cell' as const,
  ...(header ? { header: true as const } : {}),
  children: [{ type: 'paragraph' as const, children: [{ text: '' }] }],
});

function cloneDescendant(node: Descendant): Descendant {
  if (SlateText.isText(node)) return { ...node };
  return {
    ...node,
    children: node.children.map(cloneDescendant),
  };
}

export function withTable(editor: Editor): Editor {
  const {
    deleteFragment,
    normalizeNode,
    getFragment,
    insertFragment,
    deleteBackward,
  } = editor;
  editor.insertFragment = fragment => {
    const selectedTableArea = getSelectedTableArea(editor);
    if (
      !selectedTableArea ||
      fragment.length !== 1 ||
      fragment[0].type !== 'table'
    ) {
      insertFragment(fragment);
      return;
    }
    const newRows = fragment[0].children.flatMap(child =>
      child.type === 'table-head' || child.type === 'table-body'
        ? child.children
        : []
    );
    if (!newRows.every(nodeTypeMatcher('table-row'))) {
      insertFragment(fragment);
      return;
    }

    let { row, column, tablePath, table } = selectedTableArea;
    const existingBody =
      selectedTableArea.table.children[
        selectedTableArea.table.children.length === 1 ? 0 : 1
      ];
    if (
      newRows[0].type !== 'table-row' ||
      existingBody.type !== 'table-body' ||
      existingBody.children[0].type !== 'table-row'
    ) {
      insertFragment(fragment);
      return;
    }
    const hasHead = table.children[0].type === 'table-head';
    if (selectedTableArea.singleCell !== 'many') {
      row = {
        start: row.start,
        end: Math.min(
          row.start + newRows.length - 1,
          existingBody.children.length - 1 + (hasHead ? 1 : 0)
        ),
      };
      column = {
        start: column.start,
        end: Math.min(
          column.start + newRows[0].children.length - 1,
          existingBody.children[0].children.length - 1
        ),
      };
    }
    Editor.withoutNormalizing(editor, () => {
      for (let rowIndex = row.start; rowIndex <= row.end; rowIndex++) {
        const newRow = newRows[(rowIndex - row.start) % newRows.length];
        for (
          let cellIndex = column.start;
          cellIndex <= column.end;
          cellIndex++
        ) {
          const relativeCellPath = [
            ...getRelativeRowPath(hasHead, rowIndex),
            cellIndex,
          ];
          const cell = Node.get(table, relativeCellPath);
          const newCell =
            newRow.children[
              (cellIndex - column.start) % newRow.children.length
            ];
          if (cell.type !== 'table-cell' || newCell.type !== 'table-cell') {
            continue;
          }
          const cellPath = [...tablePath, ...relativeCellPath];
          for (const childIdx of [...cell.children.keys()].reverse()) {
            Transforms.removeNodes(editor, {
              at: [...cellPath, childIdx],
            });
          }
          Transforms.insertNodes(
            editor,
            newCell.children.map(cloneDescendant),
            { at: [...cellPath, 0] }
          );
        }
      }
      Transforms.setSelection(editor, {
        anchor: Editor.start(editor, [
          ...tablePath,
          ...getRelativeRowPath(hasHead, row.start),
          column.start,
        ]),
        focus: Editor.end(editor, [
          ...tablePath,
          ...getRelativeRowPath(hasHead, row.end),
          column.end,
        ]),
      });
    });
  };
  editor.deleteBackward = unit => {
    if (
      editor.selection &&
      Range.isCollapsed(editor.selection) &&
      editor.selection.anchor.offset === 0
    ) {
      const tableCell = Editor.above(editor, {
        match: nodeTypeMatcher('table-cell'),
      });
      if (
        tableCell &&
        tableCell[0].children[0].type === 'paragraph' &&
        tableCell[0].children[0].children[0].type === undefined &&
        Path.equals(editor.selection.anchor.path, [...tableCell[1], 0, 0])
      ) {
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.getFragment = () => {
    const selectedTableArea = getSelectedTableArea(editor);
    if (selectedTableArea && selectedTableArea.singleCell !== 'not-selected') {
      const { table } = selectedTableArea;
      const first =
        table.children[0].type === 'table-head' ||
        table.children[0].type === 'table-body'
          ? table.children[0]
          : undefined;
      if (!first) {
        return getFragment();
      }
      const second =
        table.children[1]?.type === 'table-body'
          ? table.children[1]
          : undefined;
      const body = second || first;
      const hasHead = first.type === 'table-head';
      const isSelectionInHead = selectedTableArea.row.start === 0 && !!second;
      const columnLength =
        selectedTableArea.column.end - selectedTableArea.column.start + 1;
      return [
        {
          type: 'table',
          children: [
            ...(isSelectionInHead
              ? [
                  {
                    type: 'table-head' as const,
                    children: [
                      {
                        type: 'table-row' as const,
                        children: Array.from({ length: columnLength }).map(
                          (_, columnIndex) =>
                            (first.children[0] as Element).children[
                              columnIndex + selectedTableArea.column.start
                            ]
                        ),
                      },
                    ],
                  },
                ]
              : []),
            {
              type: 'table-body',
              children: Array.from({
                length:
                  selectedTableArea.row.end -
                  selectedTableArea.row.start +
                  (isSelectionInHead ? 0 : 1),
              }).map((_, rowIndex) => ({
                type: 'table-row',
                children: Array.from({ length: columnLength }).map(
                  (_, columnIndex) =>
                    (
                      body.children[
                        rowIndex +
                          selectedTableArea.row.start -
                          (hasHead && !isSelectionInHead ? 1 : 0)
                      ] as Element
                    ).children[columnIndex + selectedTableArea.column.start]
                ),
              })),
            },
          ],
        },
      ];
    }
    return getFragment();
  };
  editor.deleteFragment = direction => {
    if (!editor.selection || Range.isCollapsed(editor.selection)) {
      deleteFragment(direction);
      return;
    }
    const selectedTableArea = getSelectedTableArea(editor);
    if (!selectedTableArea || selectedTableArea.singleCell === 'not-selected') {
      deleteFragment(direction);
      return;
    }
    const headOrBody = selectedTableArea.table.children[0];
    if (
      !Element.isElement(headOrBody) ||
      !Element.isElement(headOrBody.children[0])
    ) {
      deleteFragment(direction);
      return;
    }
    const maxRowIdx =
      selectedTableArea.table.children.reduce(
        (sum, headOrBody) =>
          sum +
          (headOrBody.type === 'table-head' || headOrBody.type === 'table-body'
            ? headOrBody.children.length
            : 0),
        0
      ) - 1;
    const { row, column, tablePath } = selectedTableArea;
    // note the fact that hasWholeColumnSelected uses row and hasWholeRowSelected uses column
    // is not a mistake. if a whole column has been selected, then the starting row is 0 and the end is the last row
    const hasWholeColumnSelected = row.start === 0 && row.end === maxRowIdx;
    const hasWholeRowSelected =
      column.start === 0 &&
      column.end === headOrBody.children[0].children.length - 1;
    if (hasWholeColumnSelected && hasWholeRowSelected) {
      Transforms.removeNodes(editor, { at: tablePath });
      return;
    }
    const hasHead = headOrBody.type === 'table-head';

    if (hasWholeRowSelected) {
      Editor.withoutNormalizing(editor, () => {
        for (let i = row.end; i >= row.start; i--) {
          if (hasHead) {
            if (i === 0) {
              Transforms.removeNodes(editor, {
                at: [...tablePath, 0],
              });
              continue;
            }
            Transforms.removeNodes(editor, {
              at: [...tablePath, 1, i - 1],
            });
            continue;
          }
          Transforms.removeNodes(editor, {
            at: [...tablePath, 0, i],
          });
        }
      });
      return;
    }

    if (hasWholeColumnSelected) {
      Editor.withoutNormalizing(editor, () => {
        for (let i = column.end; i >= column.start; i--) {
          for (let rowIdx = 0; rowIdx <= maxRowIdx; rowIdx++) {
            Transforms.removeNodes(editor, {
              at: [...tablePath, ...getRelativeRowPath(hasHead, rowIdx), i],
            });
          }
        }
        const selectionPath = [...tablePath, 0, 0, column.start];
        const point = Editor.start(
          editor,
          column.start === 0 ? selectionPath : Path.previous(selectionPath)
        );
        Transforms.select(editor, point);
      });
      return;
    }
    const selectionStart = Editor.start(editor, editor.selection).path;
    Editor.withoutNormalizing(editor, () => {
      for (let rowIndex = row.start; rowIndex <= row.end; rowIndex++) {
        for (
          let cellIndex = column.start;
          cellIndex <= column.end;
          cellIndex++
        ) {
          const relativeCellPath = [
            ...getRelativeRowPath(hasHead, rowIndex),
            cellIndex,
          ];
          const cell = Node.get(selectedTableArea.table, relativeCellPath);
          if (!Element.isElement(cell)) {
            continue;
          }

          const cellPath = [...tablePath, ...relativeCellPath];

          Transforms.insertNodes(
            editor,
            { type: 'paragraph', children: [{ text: '' }] },
            { at: [...cellPath, 0] }
          );
          for (const childIdx of [...cell.children.keys()].reverse()) {
            Transforms.removeNodes(editor, {
              at: [...cellPath, childIdx + 1],
            });
          }
        }
      }
      Transforms.select(editor, selectionStart);
    });
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (node.type === 'table-head' && node.children.length > 1) {
      moveChildren(editor, path, Path.next(path), (_, i) => i !== 0);
      return;
    }
    let didUpdateThings = false;
    for (const parent of ['table-body', 'table-head'] as const) {
      if (node.type === parent) {
        for (const [rowIdx, row] of node.children.entries()) {
          if (row.type === 'table-row') {
            for (const [cellIdx, cell] of row.children.entries()) {
              if (cell.type === 'table-cell') {
                const at = [...path, rowIdx, cellIdx];
                if (cell.header && parent === 'table-body') {
                  Transforms.unsetNodes(editor, 'header', { at });
                  didUpdateThings = true;
                }
                if (!cell.header && parent === 'table-head') {
                  Transforms.setNodes(editor, { header: true }, { at });
                  didUpdateThings = true;
                }
              }
            }
          }
        }
      }
    }
    if (didUpdateThings) {
      return;
    }
    if (node.type === 'table') {
      const maxRowCount = node.children.reduce(
        (max, node) =>
          node.type === 'table-head' || node.type === 'table-body'
            ? node.children.reduce(
                (max, node) =>
                  node.type === 'table-row'
                    ? Math.max(max, node.children.length)
                    : max,
                max
              )
            : max,
        0
      );
      let didInsert = false;
      for (const [idx, child] of node.children.entries()) {
        if (child.type === 'table-body' || child.type === 'table-head') {
          for (const [rowIdx, row] of child.children.entries()) {
            if (
              row.type === 'table-row' &&
              row.children.length !== maxRowCount
            ) {
              Transforms.insertNodes(
                editor,
                Array.from({ length: maxRowCount - row.children.length }, () =>
                  cell(child.type === 'table-head')
                ),
                { at: [...path, idx, rowIdx, row.children.length] }
              );
              didInsert = true;
            }
          }
        }
      }
      if (didInsert) {
        return;
      }
      if (
        node.children.length === 1 &&
        node.children[0].type === 'table-head'
      ) {
        Transforms.insertNodes(
          editor,
          {
            type: 'table-body',
            children: Array.from(
              { length: node.children[0].children.length },
              () => cell(false)
            ),
          },
          { at: [...path, 1] }
        );
        return;
      }
      if (
        node.children.length === 2 &&
        node.children[1].type === 'table-head'
      ) {
        Transforms.moveNodes(editor, {
          at: [...path, 1],
          to: [...path, 0],
        });
        return;
      }
      if (node.children.length > 2) {
        moveChildren(
          editor,
          path,
          Path.next(path),
          (_, i) => i !== 0 && i !== 1
        );
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}
