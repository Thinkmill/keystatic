import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { chevronDownIcon } from '@keystar/ui/icon/icons/chevronDownIcon';
import { MenuTrigger, Menu } from '@keystar/ui/menu';
import { css, tokenSchema } from '@keystar/ui/style';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';
import { Item } from 'react-stately/Item';
import { Command, EditorState, Plugin } from 'prosemirror-state';
import {
  addColumnAfter,
  addRowAfter,
  deleteColumn,
  deleteRow,
} from 'prosemirror-tables';
import { useEditorDispatchCommand, useEditorState } from '../editor-view';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { ResolvedPos } from 'prosemirror-model';
import { createPortal } from 'react-dom';
import type { LocalizedMessageKey } from '../../../../../app/l10n/default-locale';
import { useLocalizedString } from '../../../../../app/shell/i18n';

const cellActions: Record<
  string,
  { label: LocalizedMessageKey; command: Command }
> = {
  deleteRow: { label: 'deleteRow', command: deleteRow },
  deleteColumn: { label: 'deleteColumn', command: deleteColumn },
  insertRowBelow: { label: 'insertRowBelow', command: addRowAfter },
  insertColumnRight: { label: 'insertColumnRight', command: addColumnAfter },
};

function CellMenu() {
  const runCommand = useEditorDispatchCommand();
  const stringFormatter = useLocalizedString();
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
            aria-label={stringFormatter.format('cellOptions')}
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
              if (key in cellActions) {
                runCommand(cellActions[key].command);
              }
            }}
            items={Object.entries(cellActions).map(([key, item]) => ({
              ...item,
              key,
            }))}
          >
            {item => (
              <Item key={item.key}>{stringFormatter.format(item.label)}</Item>
            )}
          </Menu>
        </MenuTrigger>
        <Tooltip>{stringFormatter.format('options')}</Tooltip>
      </TooltipTrigger>
    </div>
  );
}

function getDecoration(state: EditorState) {
  const cellPos = findCellPosAbove(state.selection.$from);
  if (cellPos !== undefined) {
    const element = document.createElement('div');
    const decoration = Decoration.widget(cellPos + 1, element, {
      element,
      side: 1,
    });
    return { set: DecorationSet.create(state.doc, [decoration]), element };
  }
}

const _tableCellMenuPlugin: Plugin<
  { set: DecorationSet; element: HTMLDivElement } | undefined
> = new Plugin({
  state: {
    init(config, state) {
      return getDecoration(state);
    },
    apply(tr, oldPluginState, oldState, state) {
      return getDecoration(state);
    },
  },
  props: {
    decorations(state) {
      return _tableCellMenuPlugin.getState(state)?.set;
    },
  },
});
export function tableCellMenuPlugin() {
  return _tableCellMenuPlugin;
}

export function CellMenuPortal() {
  const state = useEditorState();
  const element = _tableCellMenuPlugin.getState(state)?.element;
  if (!element) return null;
  return createPortal(<CellMenu />, element);
}

function findCellPosAbove($pos: ResolvedPos) {
  for (let d = $pos.depth; d > 0; d--) {
    const node = $pos.node(d);
    const role = node.type.spec.tableRole;
    if (role === 'cell' || role === 'header_cell') {
      return $pos.before(d);
    }
  }
}
