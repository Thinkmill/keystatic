import { Node } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';
import {
  ReactElement,
  RefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { EditorSchema, getEditorSchema } from '../schema';
import { BlockPopover } from '../primitives/BlockPopover';
import { ActionButton } from '@voussoir/button';
import { Icon } from '@voussoir/icon';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Flex } from '@voussoir/layout';
import { TooltipTrigger, Tooltip } from '@voussoir/tooltip';
import {
  useEditorViewRef,
  useEditorDispatchCommand,
  useLayoutEffectWithEditorUpdated,
} from '../editor-view';
import { LinkToolbar } from './link-toolbar';
import { ToolbarSeparator } from '../primitives';
import { CodeBlockLanguageCombobox } from './code-block-language';

type PopoverRenderer = (props: {
  node: Node;
  state: EditorState;
  pos: number;
}) => ReactElement | null;

const popoverComponents: Record<string, PopoverRenderer> = {
  code_block: function CodeBlockPopover(props) {
    const viewRef = useEditorViewRef();
    const dispatchCommand = useEditorDispatchCommand();
    const triggerRef = useMemo((): RefObject<HTMLElement | null> => {
      return {
        get current() {
          if (!viewRef.current) return null;
          const { node } = viewRef.current.domAtPos(props.pos + 1);
          if (!(node instanceof HTMLElement)) return null;
          return node.parentElement;
        },
      };
    }, [props.pos, viewRef]);
    const updatePositionRef = useRef<() => void>(() => {});
    useLayoutEffectWithEditorUpdated(
      useCallback(() => {
        // just to indicate that this is a dependency of the effect
        // because we want to update the position when the state changes
        // eslint-disable-next-line no-unused-expressions
        props.state;
        updatePositionRef.current();
      }, [props.state, updatePositionRef])
    );
    return (
      <BlockPopover triggerRef={triggerRef} ref={updatePositionRef}>
        <Flex gap="regular" padding="regular">
          <CodeBlockLanguageCombobox
            value={props.node.attrs.language}
            onChange={val => {
              dispatchCommand((state, dispatch) => {
                if (dispatch) {
                  dispatch(
                    state.tr.setNodeMarkup(props.pos, undefined, {
                      ...props.node.attrs,
                      language: val,
                    })
                  );
                }
                return true;
              });
            }}
          />
          <ToolbarSeparator />
          <TooltipTrigger>
            <ActionButton
              prominence="low"
              onPress={() => {
                dispatchCommand((state, dispatch) => {
                  if (dispatch) {
                    dispatch(
                      state.tr.delete(
                        props.pos,
                        props.pos + props.node.nodeSize
                      )
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
      </BlockPopover>
    );
  },
} satisfies Partial<Record<keyof EditorSchema['nodes'], PopoverRenderer>>;

// TODO: this is broken
const LinkPopover: PopoverRenderer = props => {
  const viewRef = useEditorViewRef();
  const dispatchCommand = useEditorDispatchCommand();
  const triggerRef = useMemo((): RefObject<HTMLElement | null> => {
    return {
      get current() {
        if (!viewRef.current) return null;
        const { node } = viewRef.current.domAtPos(props.pos + 1);
        if (!(node instanceof HTMLElement)) return null;
        return node;
      },
    };
  }, [props.pos, viewRef]);
  const updatePositionRef = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    viewRef.current?.updateState(props.state);
    updatePositionRef.current?.();
  }, [props.pos, props.state, triggerRef, viewRef, updatePositionRef]);
  const schema = getEditorSchema(props.state.schema);
  if (!schema.marks.link) return null;
  const href = schema.marks.link.isInSet(props.node.marks)?.attrs.href;
  if (typeof href !== 'string') {
    return null;
  }
  return (
    <BlockPopover triggerRef={triggerRef} ref={updatePositionRef}>
      <LinkToolbar
        href={href}
        onUnlink={() => {
          dispatchCommand((state, dispatch) => {
            if (dispatch) {
              dispatch(
                state.tr.removeMark(
                  props.pos,
                  props.pos + props.node.nodeSize,
                  state.schema.marks.link
                )
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
                  .removeMark(
                    props.pos,
                    props.pos + props.node.nodeSize,
                    state.schema.marks.link
                  )
                  .addMark(
                    props.pos,
                    props.pos + props.node.nodeSize,
                    state.schema.marks.link.create({ href })
                  )
              );
            }
            return true;
          });
        }}
      />
    </BlockPopover>
  );
};

function getPopoverDecoration(
  state: EditorState
): { node: Node; component: PopoverRenderer; pos: number } | null {
  if (state.selection instanceof TextSelection) {
    const schema = getEditorSchema(state.schema);
    if (schema.marks.link) {
      const { $from, $to } = state.selection;
      const nodeAfterFrom = $from.nodeAfter;
      const nodeAfterTo = $to.nodeAfter;
      if (nodeAfterFrom && nodeAfterTo) {
        const linkMarkInFrom = schema.marks.link.isInSet(nodeAfterFrom.marks);
        const linkMarkInTo = schema.marks.link.isInSet(nodeAfterTo.marks);
        if (linkMarkInFrom && linkMarkInTo === linkMarkInTo) {
          return { node: nodeAfterTo, component: LinkPopover, pos: $from.pos };
        }
      }
    }
  }
  const commonAncestorPos = state.selection.$from.start(
    state.selection.$from.sharedDepth(state.selection.to)
  );
  const $pos = state.doc.resolve(commonAncestorPos);
  for (let i = $pos.depth; i > 0; i++) {
    const node = $pos.node(i);
    if (!node) break;
    const renderer = popoverComponents[node.type.name];
    if (renderer !== undefined) {
      return { node, component: renderer, pos: $pos.start(i) - 1 };
    }
  }

  return null;
}

export function EditorPopover(props: { state: EditorState }) {
  const popoverDecoration = useMemo(
    () => getPopoverDecoration(props.state),
    [props.state]
  );
  if (!popoverDecoration) return null;
  return (
    <popoverDecoration.component
      key={popoverDecoration.node.type.name}
      node={popoverDecoration.node}
      pos={popoverDecoration.pos}
      state={props.state}
    />
  );
}
