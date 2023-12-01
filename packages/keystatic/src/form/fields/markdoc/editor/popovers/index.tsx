import { Mark, MarkType, Node, ResolvedPos } from 'prosemirror-model';
import { EditorState, NodeSelection, TextSelection } from 'prosemirror-state';
import { toggleHeader } from 'prosemirror-tables';
import { ReactElement, useMemo } from 'react';
import { Rect } from '@floating-ui/react';

import { ActionButton } from '@keystar/ui/button';
import { EditorPopover, EditorPopoverProps } from '@keystar/ui/editor';
import { Icon } from '@keystar/ui/icon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Divider, Flex } from '@keystar/ui/layout';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';
import { sheetIcon } from '@keystar/ui/icon/icons/sheetIcon';

import { useEditorDispatchCommand, useEditorSchema } from '../editor-view';
import { EditorSchema, getEditorSchema } from '../schema';
import { CodeBlockLanguageCombobox } from './code-block-language';
import { LinkToolbar } from './link-toolbar';
import { useEditorReferenceElement } from './reference';
import { getContent, getToolbar, useEditorContext } from '../context';
import { ImagePopover } from './images';

type NodePopoverRenderer = (props: {
  node: Node;
  state: EditorState;
  pos: number;
}) => ReactElement | null;

const popoverComponents: Record<string, NodePopoverRenderer> = {
  code_block: function CodeBlockPopover(props) {
    const dispatchCommand = useEditorDispatchCommand();
    return (
      <Flex gap="regular" padding="regular">
        <CodeBlockLanguageCombobox
          value={props.node.attrs.language}
          onChange={val => {
            dispatchCommand((state, dispatch) => {
              if (dispatch) {
                dispatch(state.tr.setNodeAttribute(props.pos, 'language', val));
              }
              return true;
            });
          }}
        />
        <Divider orientation="vertical" />
        <TooltipTrigger>
          <ActionButton
            prominence="low"
            onPress={() => {
              dispatchCommand((state, dispatch) => {
                if (dispatch) {
                  dispatch(
                    state.tr.delete(props.pos, props.pos + props.node.nodeSize)
                  );
                }
                return true;
              });
            }}
          >
            <Icon src={trash2Icon} />
          </ActionButton>
          <Tooltip tone="critical">Remove</Tooltip>
        </TooltipTrigger>
      </Flex>
    );
  },
  image: ImagePopover,
  table: function TablePopover(props) {
    const dispatchCommand = useEditorDispatchCommand();
    const schema = useEditorSchema();

    return (
      <Flex gap="regular" padding="regular">
        <TooltipTrigger>
          <ActionButton
            prominence="low"
            isSelected={
              props.node.firstChild?.firstChild?.type ===
              schema.nodes.table_header
            }
            onPress={() => {
              dispatchCommand(toggleHeader('row'));
            }}
          >
            <Icon src={sheetIcon} />
          </ActionButton>
          <Tooltip>Header row</Tooltip>
        </TooltipTrigger>
        <Divider orientation="vertical" />
        <TooltipTrigger>
          <ActionButton
            prominence="low"
            onPress={() => {
              dispatchCommand((state, dispatch) => {
                if (dispatch) {
                  dispatch(
                    state.tr.delete(props.pos, props.pos + props.node.nodeSize)
                  );
                }
                return true;
              });
            }}
          >
            <Icon src={trash2Icon} />
          </ActionButton>
          <Tooltip tone="critical">Remove</Tooltip>
        </TooltipTrigger>
      </Flex>
    );
  },
} satisfies Partial<Record<keyof EditorSchema['nodes'], NodePopoverRenderer>>;

function markAround($pos: ResolvedPos, markType: MarkType) {
  const { parent, parentOffset } = $pos;
  const start = parent.childAfter(parentOffset);
  if (!start.node) return null;

  const mark = start.node.marks.find(mark => mark.type === markType);
  if (!mark) return null;

  let startIndex = $pos.index();
  let startPos = $pos.start() + start.offset;
  let endIndex = startIndex + 1;
  let endPos = startPos + start.node.nodeSize;
  while (startIndex > 0 && mark.isInSet(parent.child(startIndex - 1).marks)) {
    startIndex -= 1;
    startPos -= parent.child(startIndex).nodeSize;
  }
  while (
    endIndex < parent.childCount &&
    mark.isInSet(parent.child(endIndex).marks)
  ) {
    endPos += parent.child(endIndex).nodeSize;
    endIndex += 1;
  }
  return { from: startPos, to: endPos, mark };
}

type MarkPopoverRenderer = (props: {
  mark: Mark;
  state: EditorState;
  from: number;
  to: number;
}) => ReactElement | null;

const LinkPopover: MarkPopoverRenderer = props => {
  const dispatchCommand = useEditorDispatchCommand();
  const href = props.mark.attrs.href;
  if (typeof href !== 'string') {
    return null;
  }
  return (
    <LinkToolbar
      href={href}
      onUnlink={() => {
        dispatchCommand((state, dispatch) => {
          if (dispatch) {
            dispatch(
              state.tr.removeMark(props.from, props.to, state.schema.marks.link)
            );
          }
          return true;
        });
      }}
      onHrefChange={href => {
        dispatchCommand((state, dispatch) => {
          if (dispatch) {
            dispatch(
              state.tr
                .removeMark(props.from, props.to, state.schema.marks.link)
                .addMark(
                  props.from,
                  props.to,
                  state.schema.marks.link.create({ href })
                )
            );
          }
          return true;
        });
      }}
    />
  );
};

type PopoverDecoration =
  | {
      adaptToBoundary: EditorPopoverProps['adaptToBoundary'] & {};
      kind: 'node';
      component: NodePopoverRenderer;
      node: Node;
      pos: number;
    }
  | {
      adaptToBoundary: EditorPopoverProps['adaptToBoundary'] & {};
      kind: 'mark';
      component: MarkPopoverRenderer;
      mark: Mark;
      from: number;
      to: number;
    };
function getPopoverDecoration(state: EditorState): PopoverDecoration | null {
  if (state.selection instanceof TextSelection) {
    const schema = getEditorSchema(state.schema);
    const linkAroundFrom = markAround(state.selection.$from, schema.marks.link);
    const linkAroundTo = markAround(state.selection.$to, schema.marks.link);
    if (
      linkAroundFrom &&
      linkAroundFrom.from === linkAroundTo?.from &&
      linkAroundFrom.to === linkAroundTo.to
    ) {
      return {
        adaptToBoundary: 'flip',
        kind: 'mark',
        component: LinkPopover,
        mark: linkAroundFrom.mark,
        from: linkAroundFrom.from,
        to: linkAroundFrom.to,
      };
    }
  }

  if (state.selection instanceof NodeSelection) {
    const node = state.selection.node;
    const component = popoverComponents[node.type.name];
    if (component !== undefined) {
      return {
        adaptToBoundary: 'stick',
        kind: 'node',
        node,
        component,
        pos: state.selection.from,
      };
    }
  }
  const commonAncestorPos = state.selection.$from.start(
    state.selection.$from.sharedDepth(state.selection.to)
  );
  const $pos = state.doc.resolve(commonAncestorPos);

  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i);
    if (!node) break;
    const component = popoverComponents[node.type.name];
    if (component !== undefined) {
      return {
        adaptToBoundary: 'stick',
        kind: 'node',
        node,
        component,
        pos: $pos.start(i) - 1,
      };
    }
  }

  return null;
}

function PopoverInner(props: {
  decoration: PopoverDecoration;
  state: EditorState;
}) {
  const from =
    props.decoration.kind === 'node'
      ? props.decoration.pos
      : props.decoration.from;
  const to =
    props.decoration.kind === 'node'
      ? props.decoration.pos + props.decoration.node.nodeSize
      : props.decoration.to;

  const reference = useEditorReferenceElement(from, to);
  const boundary = useBoundaryRect();

  return (
    reference && (
      <EditorPopover
        adaptToBoundary={props.decoration.adaptToBoundary}
        boundary={boundary}
        minWidth="element.medium"
        placement="bottom"
        reference={reference}
      >
        {props.decoration.kind === 'node' ? (
          <props.decoration.component
            {...props.decoration}
            state={props.state}
          />
        ) : (
          <props.decoration.component
            {...props.decoration}
            state={props.state}
          />
        )}
      </EditorPopover>
    )
  );
}

export function EditorPopoverDecoration(props: { state: EditorState }) {
  const popoverDecoration = useMemo(
    () => getPopoverDecoration(props.state),
    [props.state]
  );
  if (!popoverDecoration) return null;
  return <PopoverInner decoration={popoverDecoration} state={props.state} />;
}

export function useBoundaryRect(): Rect | undefined {
  let { id } = useEditorContext();

  let element = getContent(id);
  if (!element) {
    return undefined;
  }

  let scrollParent = getNearestScrollParent(element);
  if (!scrollParent) {
    return undefined;
  }

  let toolbar = getToolbar(id);
  let offset = toolbar?.offsetHeight ?? 0;
  let rect = scrollParent.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y + offset,
    width: rect.width,
    height: rect.height - offset,
  };
}

function getNearestScrollParent(element: Element | null): Element | null {
  if (!element) {
    return null;
  }
  if (element.scrollHeight > element.clientHeight) {
    return element;
  }
  return getNearestScrollParent(element.parentElement);
}
