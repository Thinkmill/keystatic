import {
  ContextType,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { Descendant, Editor, Element, Node, Path, Transforms } from 'slate';
import {
  ReactEditor,
  RenderElementProps,
  useSlate,
  useSlateStatic,
} from 'slate-react';

import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { chevronDownIcon } from '@keystar/ui/icon/icons/chevronDownIcon';
import { sheetIcon } from '@keystar/ui/icon/icons/sheetIcon';
import { tableIcon } from '@keystar/ui/icon/icons/tableIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Flex } from '@keystar/ui/layout';
import { Item, Menu, MenuTrigger } from '@keystar/ui/menu';
import { css, toDataAttributes, tokenSchema } from '@keystar/ui/style';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';
import { Text } from '@keystar/ui/typography';

import {
  BlockPopover,
  BlockPopoverTrigger,
  BlockWrapper,
  ToolbarSeparator,
} from '../primitives';
import { useToolbarState } from '../toolbar-state';
import { nodeTypeMatcher } from '../utils';
import { cell, getRelativeRowPath, getSelectedTableArea } from './with-table';

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

const SelectedCellsContext = createContext<
  | {
      table: Element & { type: 'table' };
      focus: Descendant;
      cells: Set<Descendant>;
    }
  | undefined
>(undefined);

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

export function TableSelectionProvider(props: { children: ReactNode }) {
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
  const editor = useSlateStatic();
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
        <BlockWrapper attributes={attributes}>
          <BlockPopoverTrigger element={element}>
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
            >
              {children}
            </table>
            <BlockPopover>
              <Flex gap="regular" padding="regular">
                <TooltipTrigger>
                  <ActionButton
                    prominence="low"
                    isSelected={element.children[0]?.type === 'table-head'}
                    onPress={() => {
                      const tablePath = ReactEditor.findPath(editor, element);
                      Editor.withoutNormalizing(editor, () => {
                        if (element.children[0].type === 'table-head') {
                          Transforms.moveNodes(editor, {
                            at: [...tablePath, 0, 0],
                            to: [...tablePath, 1, 0],
                          });
                          Transforms.removeNodes(editor, {
                            at: [...tablePath, 0],
                          });
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
                    }}
                  >
                    <Icon src={sheetIcon} />
                  </ActionButton>
                  <Tooltip>Header row</Tooltip>
                </TooltipTrigger>
                <ToolbarSeparator />
                <TooltipTrigger>
                  <ActionButton
                    prominence="low"
                    onPress={() => {
                      Transforms.removeNodes(editor, {
                        at: ReactEditor.findPath(editor, element),
                      });
                    }}
                  >
                    <Icon src={trash2Icon} />
                  </ActionButton>
                  <Tooltip tone="critical">Remove</Tooltip>
                </TooltipTrigger>
              </Flex>
            </BlockPopover>
          </BlockPopoverTrigger>
        </BlockWrapper>
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
  const editor = useSlateStatic();
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
  const editor = useSlateStatic();

  let { location, selected } = props;

  return (
    <div contentEditable={false}>
      <button
        tabIndex={-1}
        type="button"
        {...toDataAttributes({ location, selected })}
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
  const editor = useSlateStatic();
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
        <MenuTrigger align="end">
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
