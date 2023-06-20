import { matchSorter } from 'match-sorter';
import { Command, NodeSelection, Transaction } from 'prosemirror-state';
import { useMemo } from 'react';
import {
  addAutocompleteDecoration,
  removeAutocompleteDecoration,
  wrapCommandAfterRemovingAutocompleteDecoration,
} from '../autocomplete/decoration';
import {
  useEditorViewRef,
  useEditorState,
  useEditorDispatchCommand,
} from '../editor-view';
import { Item } from '../new-primitives';
import { InputRule } from '../inputrules/inputrules';
import { useEditorKeydownListener } from '../keydown';
import { EditorAutocomplete } from '../autocomplete/autocomplete';
import { ResolvedPos } from 'prosemirror-model';
import { getAttributeType } from './schema';
import { getEditorSchema } from '../schema';
import { globalAttributes } from '@markdoc/markdoc';
import { domNodeToEditorView } from '.';

type AttributeItem = {
  name: string;
  extra: string | undefined;
  command: Command;
};

export const attributeMenuInputRule: InputRule = {
  pattern: /(?:^|\s)%$/,
  handler(state, _match, _start, end) {
    return addNewAttributeAutocompleteDecoration(state.tr, end - 1, end);
  },
};

function getDeepestAncestorAttributeSchema(pos: ResolvedPos) {
  for (let depth = pos.depth; depth >= 0; depth--) {
    const node = pos.node(depth);
    if (node.type.name === 'paragraph' || node.type.name === 'heading') {
      return node as typeof node & { type: { name: 'paragraph' | 'heading' } };
    }
  }
}

export function addNewAttributeAutocompleteDecoration(
  tr: Transaction,
  from: number,
  to: number
): Transaction {
  return addAutocompleteDecoration(
    tr,
    NewAttributeMenu,
    from,
    to,
    /^(?:[a-zA-Z][-_a-zA-Z0-9]*)?$/
  );
}

function childRenderer(item: AttributeItem) {
  return (
    <Item key={item.name} textValue={item.name}>
      {item.name}
    </Item>
  );
}

function addAttribute(name: string): Command {
  return (state, dispatch, view) => {
    if (dispatch) {
      const tr = state.tr;
      tr.insert(
        state.selection.from,
        getAttributeType(state.schema).createAndFill({ name })!
      );
      tr.setSelection(new NodeSelection(tr.doc.resolve(state.selection.from)));
      dispatch(tr);
      Promise.resolve().then(() => {
        const node = view?.nodeDOM(view?.state.selection.from);
        if (!node) return;
        domNodeToEditorView.get(node)?.focus();
      });
    }
    return true;
  };
}

function NewAttributeMenu(props: { query: string; from: number; to: number }) {
  const viewRef = useEditorViewRef();
  const dispatchCommand = useEditorDispatchCommand();
  const editorState = useEditorState();
  const ancestorNodeAllowingAttributes = getDeepestAncestorAttributeSchema(
    editorState.doc.resolve(props.from)
  );
  const options = useMemo(
    () =>
      matchSorter(
        ((): AttributeItem[] => {
          if (!ancestorNodeAllowingAttributes?.type) return [];
          const attributes = {
            ...globalAttributes,
            ...getEditorSchema(ancestorNodeAllowingAttributes.type.schema)
              .markdocConfig?.nodes?.[ancestorNodeAllowingAttributes.type.name]
              ?.attributes,
          };
          return Object.keys(attributes).map(name => ({
            name,
            extra: name === 'id' ? '#' : name === 'class' ? '.' : undefined,
            command: addAttribute(name),
          }));
        })(),
        props.query,
        {
          keys: ['key', 'extra'],
        }
      ),
    [props.query, ancestorNodeAllowingAttributes?.type]
  );

  useEditorKeydownListener(event => {
    if (event.key !== ' ') return false;
    if (options.length === 1) {
      dispatchCommand(
        wrapCommandAfterRemovingAutocompleteDecoration(
          addAttribute(options[0].name)
        )
      );
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
      aria-label="New attribute"
      items={options}
      children={childRenderer}
      onEscape={() => {
        viewRef.current?.dispatch(removeAutocompleteDecoration(editorState.tr));
      }}
      onAction={key => {
        const option = options.find(option => option.name === key);
        if (!option) return;
        dispatchCommand(
          wrapCommandAfterRemovingAutocompleteDecoration(
            addAttribute(option.name)
          )
        );
      }}
    />
  );
}
