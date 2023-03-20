import { ContextType, createContext, useContext, useMemo } from 'react';
import {
  Descendant,
  Editor,
  Element,
  Node,
  Path,
  Transforms,
  Range,
  Text as SlateText,
  Point,
} from 'slate';
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react';

import { ActionButton } from '@voussoir/button';
import { Icon } from '@voussoir/icon';
import { chevronDownIcon } from '@voussoir/icon/icons/chevronDownIcon';
import { tableIcon } from '@voussoir/icon/icons/tableIcon';
import { Item, Menu, MenuTrigger } from '@voussoir/menu';
import { css, tokenSchema } from '@voussoir/style';
import { TooltipTrigger, Tooltip } from '@voussoir/tooltip';
import { Text } from '@voussoir/typography';
import { toDataAttributes } from '@voussoir/utils';

import { useToolbarState } from './toolbar-state';
import { moveChildren, nodeTypeMatcher, useStaticEditor } from './utils';

const cell = (header: boolean) => ({
  type: 'table-cell' as const,
  ...(header ? { header: true as const } : {}),
  children: [{ type: 'paragraph' as const, children: [{ text: '' }] }],
});

export const insertTable = (editor: Editor) => {
  Transforms.insertNodes(editor, {
    type: 'table',
    children: [
      {
        type: 'table-head',
        children: [
          { type: 'table-row', children: [cell(true), cell(true), cell(true)] },
        ],
      },
      {
        type: 'table-body',
        children: [
          {
            type: 'table-row',
            children: [cell(false), cell(false), cell(false)],
          },
          {
            type: 'table-row',
            children: [cell(false), cell(false), cell(false)],
          },
        ],
      },
    ],
  });
};

function cloneDescendant(node: Descendant): Descendant {
  if (SlateText.isText(node)) return { ...node };
  return {
    ...node,
    children: node.children.map(cloneDescendant),
  };
}

function getRelativeRowPath(hasHead: boolean, rowIndex: number): Path {
  return hasHead
    ? rowIndex === 0
      ? [0, 0]
      : [1, rowIndex - 1]
    : [0, rowIndex];
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
      if (!first) return getFragment();
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
              at: [...tablePath, 1, i],
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
          if (!Element.isElement(cell)) continue;

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

const SelectedCellsContext = createContext<
  | {
      table: Element & { type: 'table' };
      focus: Descendant;
      cells: Set<Descendant>;
    }
  | undefined
>(undefined);

function order(a: number, b: number) {
  return { start: Math.min(a, b), end: Math.max(a, b) };
}

function getSelectedCells(
  table: Element & { type: 'table' },
  row: { start: number; end: number },
  column: { start: number; end: number }
) {
  const selectedCells = new Set<Descendant>();
  const first =
    table.children[0].type === 'table-head' ||
    table.children[0].type === 'table-body'
      ? table.children[0]
      : undefined;
  if (!first) return selectedCells;
  const second =
    table.children[1]?.type === 'table-body' ? table.children[1] : undefined;
  for (let rowIndex = row.start; rowIndex <= row.end; rowIndex++) {
    const row = second
      ? rowIndex === 0
        ? first.children[0]
        : second.children[rowIndex - 1]
      : first.children[rowIndex];
    if (!Element.isElement(row)) continue;
    for (let cellIndex = column.start; cellIndex <= column.end; cellIndex++) {
      selectedCells.add(row.children[cellIndex]);
    }
  }
  return selectedCells;
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

export function TableSelectionProvider(props: { children: React.ReactNode }) {
  const editor = useSlate();
  const selectedTableArea = getSelectedTableArea(editor);
  if (selectedTableArea) {
    return (
      <SelectedCellsContext.Provider
        value={{
          cells:
            selectedTableArea.singleCell === 'not-selected'
              ? new Set()
              : getSelectedCells(
                  selectedTableArea.table,
                  selectedTableArea.row,
                  selectedTableArea.column
                ),
          table: selectedTableArea.table,
          focus: Editor.above(editor, {
            match: nodeTypeMatcher('table-cell'),
            at: editor.selection?.focus.path,
          })?.[0]!,
        }}
      >
        {props.children}
      </SelectedCellsContext.Provider>
    );
  }

  return (
    <SelectedCellsContext.Provider value={undefined}>
      {props.children}
    </SelectedCellsContext.Provider>
  );
}

const StartElementsContext = createContext<{
  top: Map<Element, boolean>;
  left: Map<Element, boolean>;
}>({ top: new Map(), left: new Map() });

export const TableElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const selectedCellsContext = useContext(SelectedCellsContext);
  const selectedCells =
    selectedCellsContext?.table === element ? selectedCellsContext : undefined;
  const startElements = useMemo((): ContextType<
    typeof StartElementsContext
  > => {
    const firstTableChild = element.children[0];
    if (
      !Element.isElement(firstTableChild) ||
      !Element.isElement(firstTableChild.children[0])
    ) {
      return { top: new Map(), left: new Map() };
    }
    const top = new Map<Element, boolean>();
    const left = new Map<Element, boolean>();
    for (const [idx, cell] of firstTableChild.children[0].children.entries()) {
      if (cell.type !== 'table-cell') continue;
      top.set(
        cell,
        element.children.every(headOrBody =>
          Element.isElement(headOrBody)
            ? headOrBody.children.every(
                row =>
                  Element.isElement(row) &&
                  selectedCells?.cells.has(row.children[idx])
              )
            : false
        )
      );
    }
    for (const headOrBody of element.children) {
      if (
        headOrBody.type !== 'table-head' &&
        headOrBody.type !== 'table-body'
      ) {
        continue;
      }
      for (const row of headOrBody.children) {
        if (row.type !== 'table-row' || row.children[0].type !== 'table-cell') {
          continue;
        }
        left.set(
          row.children[0],
          row.children.every(element => selectedCells?.cells.has(element))
        );
      }
    }
    return { top, left };
  }, [element, selectedCells]);
  return (
    <StartElementsContext.Provider value={startElements}>
      <SelectedCellsContext.Provider value={selectedCells}>
        <div className={css({ position: 'relative' })}>
          <table
            className={css({
              width: '100%',
              tableLayout: 'fixed',
              position: 'relative',
              borderSpacing: 0,
              '& *::selection': selectedCells?.cells.size
                ? { backgroundColor: 'transparent' }
                : undefined,
            })}
            {...attributes}
          >
            {children}
          </table>
        </div>
      </SelectedCellsContext.Provider>
    </StartElementsContext.Provider>
  );
};

export const TableBodyElement = ({
  attributes,
  children,
}: RenderElementProps) => {
  return <tbody {...attributes}>{children}</tbody>;
};

export const TableHeadElement = ({
  attributes,
  children,
}: RenderElementProps) => {
  return <thead {...attributes}>{children}</thead>;
};

export const TableRowElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const table = useContext(SelectedCellsContext)?.table;
  return (
    <RowIndexContext.Provider value={table?.children.indexOf(element) ?? -1}>
      <tr {...attributes}>{children}</tr>
    </RowIndexContext.Provider>
  );
};

const RowIndexContext = createContext<number>(-1);

export function TableCellElement({
  attributes,
  children,
  element,
}: RenderElementProps & { element: { type: 'table-cell' } }) {
  const editor = useStaticEditor();
  const selectedCellsContext = useContext(SelectedCellsContext);
  const startElements = useContext(StartElementsContext);
  const isSelected = selectedCellsContext?.cells.has(element);
  const size = `calc(100% + 2px)`;
  const ElementType = element.header ? 'th' : 'td';
  const borderColor = isSelected
    ? tokenSchema.color.alias.borderSelected
    : tokenSchema.color.alias.borderIdle;
  return (
    <ElementType
      className={css({
        borderInlineEnd: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        borderTop: startElements.top.has(element)
          ? `1px solid ${borderColor}`
          : undefined,
        borderInlineStart: startElements.left.has(element)
          ? `1px solid ${borderColor}`
          : undefined,
        backgroundColor: selectedCellsContext?.cells.has(element)
          ? tokenSchema.color.alias.backgroundSelected
          : element.header
          ? tokenSchema.color.scale.slate3
          : undefined,
        position: 'relative',
        margin: 0,
        padding: tokenSchema.size.space.regular,
        fontWeight: 'inherit',
        boxSizing: 'border-box',
        textAlign: 'start',
        verticalAlign: 'top',
      })}
      {...attributes}
    >
      {isSelected && (
        <>
          <div
            contentEditable={false}
            className={css({
              position: 'absolute',
              top: -1,
              insetInlineStart: -1,
              background: tokenSchema.color.alias.borderSelected,
              height: size,
              width: 1,
            })}
          />
          <div
            contentEditable={false}
            className={css({
              position: 'absolute',
              top: -1,
              insetInlineStart: -1,
              background: tokenSchema.color.alias.borderSelected,
              height: 1,
              width: size,
            })}
          />
        </>
      )}
      {startElements.top.has(element) && (
        <CellSelection
          location="top"
          selected={!!startElements.top.get(element)}
          label="Select Column"
          onClick={() => {
            const path = ReactEditor.findPath(editor, element);
            const table = Editor.above(editor, {
              match: nodeTypeMatcher('table'),
              at: path,
            });
            if (!table) return;
            const lastTableIndex = table[0].children.length - 1;
            const tableBody = table[0].children[lastTableIndex];
            if (tableBody.type !== 'table-body') return;
            const cellIndex = path[path.length - 1];
            const endPath = [
              ...table[1],
              table[0].children.length - 1,
              tableBody.children.length - 1,
              cellIndex,
            ];
            Transforms.select(editor, {
              anchor: Editor.start(editor, path),
              focus: Editor.end(editor, endPath),
            });
          }}
        />
      )}
      {startElements.left.has(element) && (
        <CellSelection
          location="left"
          selected={!!startElements.left.get(element)}
          label="Select Row"
          onClick={() => {
            const path = ReactEditor.findPath(editor, element);
            Transforms.select(editor, {
              anchor: Editor.start(editor, Path.parent(path)),
              focus: Editor.end(editor, Path.parent(path)),
            });
          }}
        />
      )}
      {startElements.left.has(element) && startElements.top.has(element) && (
        <CellSelection
          location="top-left"
          selected={
            !!(
              startElements.top.get(element) && startElements.left.get(element)
            )
          }
          label="Select Table"
          onClick={() => {
            const path = ReactEditor.findPath(editor, element);
            const table = Editor.above(editor, {
              match: nodeTypeMatcher('table'),
              at: path,
            });
            if (!table) return;
            Transforms.select(editor, {
              anchor: Editor.start(editor, table[1]),
              focus: Editor.end(editor, table[1]),
            });
          }}
        />
      )}
      <div>{children}</div>
      {selectedCellsContext?.focus === element && (
        <CellMenu cell={element} table={selectedCellsContext.table} />
      )}
    </ElementType>
  );
}

function CellSelection(props: {
  location: 'top' | 'left' | 'top-left';
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  const selectedCellsContext = useContext(SelectedCellsContext);
  const editor = useStaticEditor();

  return (
    <div contentEditable={false}>
      <button
        tabIndex={-1}
        type="button"
        {...toDataAttributes(props, new Set(['location', 'selected']))}
        className={css({
          background: tokenSchema.color.scale.slate3,
          border: `1px solid ${tokenSchema.color.alias.borderIdle}`,
          margin: 0,
          padding: 0,
          position: 'absolute',

          ':hover': {
            background: tokenSchema.color.scale.slate4,
          },

          // ever so slightly larger hit area
          '::before': {
            content: '""',
            inset: -1,
            position: 'absolute',
          },

          // location
          '&[data-location=top]': {
            top: -9,
            insetInlineStart: -1,
            width: 'calc(100% + 2px)',
            height: 8,
          },
          '&[data-location=left]': {
            top: -1,
            insetInlineStart: -9,
            width: 8,
            height: 'calc(100% + 2px)',
          },
          '&[data-location=top-left]': {
            top: -9,
            insetInlineStart: -9,
            width: 8,
            height: 8,
          },
          '&:not([data-location=top])': { borderInlineEnd: 'none' },
          '&:not([data-location=left])': { borderBottom: 'none' },

          // state
          '&[data-selected=true]': {
            background: tokenSchema.color.scale.indigo8,
            borderColor: tokenSchema.color.alias.borderSelected,
          },
        })}
        style={{
          visibility: selectedCellsContext?.focus ? 'visible' : 'hidden',
        }}
        aria-label={props.label}
        onClick={() => {
          ReactEditor.focus(editor);
          props.onClick();
        }}
      />
      {props.selected &&
        (props.location === 'top' ? (
          <div
            className={css({
              position: 'absolute',
              top: -9,
              insetInlineEnd: -1,
              background: tokenSchema.color.alias.borderSelected,
              height: 8,
              width: 1,
              zIndex: 2,
            })}
          />
        ) : (
          <div
            className={css({
              position: 'absolute',
              bottom: -1,
              insetInlineStart: -9,
              background: tokenSchema.color.alias.borderSelected,
              height: 1,
              width: 8,
              zIndex: 2,
            })}
          />
        ))}
    </div>
  );
}

export const cellActions = {
  deleteRow: {
    label: 'Delete row',
    action: (editor, cellPath) => {
      const tablePath = cellPath.slice(0, -3);
      const table = Node.get(editor, tablePath);
      if (table.type !== 'table') return;
      const hasHead = table.children[0].type === 'table-head';
      const rowPath = Path.parent(cellPath);
      Transforms.removeNodes(editor, {
        at:
          hasHead && rowPath[cellPath.length - 3] === 0
            ? Path.parent(rowPath)
            : rowPath,
      });
    },
  },
  deleteColumn: {
    label: 'Delete column',
    action: (editor, path) => {
      const cellIndex = path[path.length - 1];
      const tablePath = path.slice(0, -3);
      const table = Node.get(editor, tablePath);
      if (table.type !== 'table') return;
      Editor.withoutNormalizing(editor, () => {
        for (const [headOrBodyIdx, headOrBody] of table.children.entries()) {
          if (
            headOrBody.type !== 'table-head' &&
            headOrBody.type !== 'table-body'
          ) {
            continue;
          }
          for (const idx of headOrBody.children.keys()) {
            Transforms.removeNodes(editor, {
              at: [...tablePath, headOrBodyIdx, idx, cellIndex],
            });
          }
        }
      });
    },
  },
  insertRowBelow: {
    label: 'Insert row below',
    action: (editor, path) => {
      const tableRow = Node.get(editor, Path.parent(path));
      const tablePath = path.slice(0, -3);
      const table = Node.get(editor, tablePath);
      if (tableRow.type !== 'table-row' || table.type !== 'table') {
        return;
      }
      const hasHead = table.children[0].type === 'table-head';
      const newRowPath = [
        ...tablePath,
        hasHead ? 1 : 0,
        hasHead && path[path.length - 3] === 0 ? 0 : path[path.length - 2] + 1,
      ];
      Editor.withoutNormalizing(editor, () => {
        Transforms.insertNodes(
          editor,
          {
            type: 'table-row',
            children: tableRow.children.map(() => cell(false)),
          },
          { at: newRowPath }
        );
        Transforms.select(editor, [...newRowPath, path[path.length - 1]]);
      });
    },
  },
  insertColumnRight: {
    label: 'Insert column right',
    action: (editor, path) => {
      const newCellIndex = path[path.length - 1] + 1;
      const tablePath = path.slice(0, -3);
      const table = Node.get(editor, tablePath);
      if (table.type !== 'table') return;
      Editor.withoutNormalizing(editor, () => {
        for (const [headOrBodyIdx, headOrBody] of table.children.entries()) {
          if (
            headOrBody.type !== 'table-head' &&
            headOrBody.type !== 'table-body'
          ) {
            continue;
          }
          for (const rowIdx of headOrBody.children.keys()) {
            Transforms.insertNodes(
              editor,
              cell(headOrBody.type === 'table-head'),
              {
                at: [...tablePath, headOrBodyIdx, rowIdx, newCellIndex],
              }
            );
          }
        }
        Transforms.select(editor, Editor.start(editor, Path.next(path)));
      });
    },
  },
  headerRow: {
    label: 'Header row',
    action: (editor, path) => {
      const tablePath = path.slice(0, -3);
      const table = Node.get(editor, tablePath);
      if (table.type !== 'table') return;
      Editor.withoutNormalizing(editor, () => {
        if (table.children[0].type === 'table-head') {
          Transforms.moveNodes(editor, {
            at: [...tablePath, 0, 0],
            to: [...tablePath, 1, 0],
          });
          Transforms.removeNodes(editor, { at: [...tablePath, 0] });
          return;
        }
        Transforms.insertNodes(
          editor,
          { type: 'table-head', children: [] },
          { at: [...tablePath, 0] }
        );
        Transforms.moveNodes(editor, {
          at: [...tablePath, 1, 0],
          to: [...tablePath, 0, 0],
        });
      });
    },
  },
} satisfies Record<
  string,
  { label: string; action: (editor: Editor, cellPath: Path) => void }
>;

const _cellActions: Record<
  string,
  { label: string; action: (editor: Editor, cellPath: Path) => void }
> = cellActions;

function CellMenu(props: {
  cell: Element;
  table: Element & { type: 'table' };
}) {
  const editor = useStaticEditor();
  const gutter = tokenSchema.size.space.small;
  return (
    <div
      contentEditable={false}
      className={css({
        top: gutter,
        insetInlineEnd: gutter,
        position: 'absolute',
      })}
    >
      <TooltipTrigger>
        <MenuTrigger>
          <ActionButton
            prominence="low"
            UNSAFE_className={css({
              borderRadius: tokenSchema.size.radius.small,
              height: 'auto',
              minWidth: 0,
              padding: 0,

              // tiny buttons; increase the hit area
              '&::before': {
                content: '""',
                inset: `calc(${gutter} * -1)`,
                position: 'absolute',
              },
            })}
          >
            <Icon src={chevronDownIcon} />
          </ActionButton>
          <Menu
            onAction={key => {
              if (key in _cellActions) {
                _cellActions[key].action(
                  editor,
                  ReactEditor.findPath(editor, props.cell)
                );
              }
            }}
            items={Object.entries(_cellActions).map(([key, item]) => ({
              ...item,
              key,
            }))}
            selectionMode="single"
            selectedKeys={
              props.table.children[0].type === 'table-head' ? ['headerRow'] : []
            }
          >
            {item => <Item key={item.key}>{item.label}</Item>}
          </Menu>
        </MenuTrigger>
        <Tooltip>Options</Tooltip>
      </TooltipTrigger>
    </div>
  );
}

const TableButton = () => {
  const {
    editor,
    blockquote: { isDisabled, isSelected },
  } = useToolbarState();
  return useMemo(
    () => (
      <ActionButton
        prominence="low"
        isSelected={isSelected}
        isDisabled={isDisabled}
        onPress={() => {
          insertTable(editor);
          ReactEditor.focus(editor);
        }}
      >
        <Icon src={tableIcon} />
      </ActionButton>
    ),
    [editor, isDisabled, isSelected]
  );
};
export const tableButton = (
  <TooltipTrigger>
    <TableButton />
    <Tooltip>
      <Text>Table</Text>
    </Tooltip>
  </TooltipTrigger>
);

export function getCellPathInDirection(
  editor: Editor,
  path: Path,
  direction: 'up' | 'down' | 'left' | 'right'
): Path | undefined {
  if (direction === 'left' || direction === 'right') {
    const row = Editor.above(editor, {
      match: nodeTypeMatcher('table-row'),
      at: path,
    });
    if (!row) return;
    const currentCellIdx = path[path.length - 1];
    const diff = direction === 'left' ? -1 : 1;
    const nextCellIdx = currentCellIdx + diff;
    const nextCell = row[0].children[nextCellIdx];
    if (!nextCell) return;
    return [...row[1], nextCellIdx];
  }
  const table = Editor.above(editor, {
    match: nodeTypeMatcher('table'),
    at: path,
  });
  if (!table) return;
  const diff = direction === 'up' ? -1 : 1;
  const rowIndex = path[path.length - 3] + path[path.length - 2];
  const nextRowIndex = rowIndex + diff;
  const relativeRowPath = getRelativeRowPath(
    table[0].children[0].type === 'table-head',
    nextRowIndex
  );
  if (!Node.has(table[0], relativeRowPath)) return;
  return [...table[1], ...relativeRowPath, path[path.length - 1]];
}
