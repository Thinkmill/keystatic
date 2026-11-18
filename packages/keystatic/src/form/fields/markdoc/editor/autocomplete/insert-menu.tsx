import { Icon } from '@keystar/ui/icon';
import { Text } from '@keystar/ui/typography';
import { matchSorter } from 'match-sorter';
import { NodeType } from 'prosemirror-model';
import { Command, EditorState } from 'prosemirror-state';
import { ReactElement, useMemo } from 'react';

import { weakMemoize } from '../utils';
import {
  addAutocompleteDecoration,
  removeAutocompleteDecoration,
  removeAutocompleteDecorationAndContent,
} from './decoration';
import {
  useEditorViewRef,
  useEditorSchema,
  useEditorState,
  useEditorDispatchCommand,
} from '../editor-view';
import { Item } from './EditorListbox';
import { InputRule } from '../inputrules/inputrules';
import { useEditorKeydownListener } from '../keydown';
import { EditorAutocomplete } from './autocomplete';
import { EditorSchema, formatInsertMenuText, InsertMenuText } from '../schema';
import { useLocalizedString } from '../../../../../app/shell/i18n';

export type InsertMenuItemSpec = {
  label: InsertMenuText;
  description?: InsertMenuText;
  icon?: ReactElement;
  command: (type: NodeType, schema: EditorSchema) => Command;
  forToolbar?: true;
};

export type WithInsertMenuNodeSpec = {
  insertMenu?: InsertMenuItemSpec[] | InsertMenuItemSpec;
};

export type InsertMenuItem = {
  id: string;
  label: InsertMenuText;
  description?: InsertMenuText;
  icon?: ReactElement;
  forToolbar?: true;
  command: Command;
};

export const insertMenuInputRule: InputRule = {
  pattern: /(?:^|\s)\/$/,
  handler(state, _match, _start, end) {
    return addAutocompleteDecoration(
      state.tr,
      InsertMenu,
      end - 1,
      end,
      undefined
    );
  },
};

const getStateWithoutAutocompleteDecoration = weakMemoize(
  (state: EditorState) => {
    const tr = removeAutocompleteDecorationAndContent(state);
    if (!tr) {
      return { state };
    }
    return { state: state.apply(tr), tr };
  }
);

function wrapInsertMenuCommand(command: Command): Command {
  return (stateWithInsertMenuText, dispatch, view): boolean => {
    const { state, tr } = getStateWithoutAutocompleteDecoration(
      stateWithInsertMenuText
    );
    if (!tr) return false;
    if (dispatch) dispatch(tr);
    return command(state, dispatch, view);
  };
}

type LocalizedInsertMenuItem = Omit<InsertMenuItem, 'label' | 'description'> & {
  label: string;
  description?: string;
};

export function useLocalizedInsertMenuItems(
  items: InsertMenuItem[]
): LocalizedInsertMenuItem[] {
  const stringFormatter = useLocalizedString();
  return useMemo(
    () =>
      items.map(item => ({
        ...item,
        label: formatInsertMenuText(stringFormatter, item.label),
        description:
          item.description === undefined
            ? undefined
            : formatInsertMenuText(stringFormatter, item.description),
      })),
    [items, stringFormatter]
  );
}

export function itemRenderer(item: LocalizedInsertMenuItem) {
  return (
    <Item key={item.id} textValue={item.label}>
      <Text>{item.label}</Text>
      {item.description && <Text slot="description">{item.description}</Text>}
      {item.icon && <Icon src={item.icon} />}
    </Item>
  );
}

function InsertMenu(props: { query: string; from: number; to: number }) {
  const viewRef = useEditorViewRef();
  const dispatchCommand = useEditorDispatchCommand();
  const schema = useEditorSchema();
  const editorState = useEditorState();
  const stringFormatter = useLocalizedString();
  const insertMenuItems = useLocalizedInsertMenuItems(schema.insertMenuItems);

  const options = useMemo(
    () =>
      matchSorter(insertMenuItems, props.query, {
        keys: ['label'],
      }).filter(option => option.command(editorState)),
    [editorState, insertMenuItems, props.query]
  );

  useEditorKeydownListener(event => {
    if (event.key !== ' ') return false;
    if (options.length === 1) {
      dispatchCommand(wrapInsertMenuCommand(options[0].command));
      return true;
    }
    if (options.length === 0) {
      viewRef.current?.dispatch(removeAutocompleteDecoration(editorState.tr));
    }
    return false;
  });
  return (
    <EditorAutocomplete
      from={props.from}
      to={props.to}
      aria-label={stringFormatter.format('insertMenu')}
      items={options}
      children={itemRenderer}
      onEscape={() => {
        const tr = removeAutocompleteDecorationAndContent(editorState);
        if (!tr) return;
        viewRef.current?.dispatch(tr);
      }}
      onAction={key => {
        const option = options.find(option => option.id === key);
        if (!option) return;
        dispatchCommand(wrapInsertMenuCommand(option.command));
      }}
    />
  );
}
