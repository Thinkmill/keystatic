import { Node, NodeType, Schema } from 'prosemirror-model';
import {
  EditorState,
  NodeSelection,
  Plugin,
  PluginKey,
} from 'prosemirror-state';
import { NodeView } from 'prosemirror-view';
import { ReactElement, ReactNode, memo } from 'react';
import { createPortal } from 'react-dom';
import { useEditorViewRef } from './editor-view';

type NodeViewInfo = {
  key: string;
  type: NodeType;
  dom: HTMLElement;
  contentDOM: HTMLElement | undefined;
};

type ReactNodeViewsState = Map<number, NodeViewInfo>;

let i = 0;

type ReactNodeViewProps = {
  hasNodeSelection: boolean;
  isNodeCompletelyWithinSelection: boolean;
  node: Node;
  children: ReactNode;
};

type ReactNodeViewSpec = {
  component: (props: ReactNodeViewProps) => ReactNode;
  rendersOwnContent?: boolean;
};

export type WithReactNodeViewSpec = {
  reactNodeView?: ReactNodeViewSpec;
};

function NodeViewContentDOM(props: { node: HTMLElement }) {
  const viewRef = useEditorViewRef();
  return (
    <span
      ref={element => {
        if (!element) return;
        element.appendChild(props.node);

        const view = viewRef.current;
        if (!view) return;
        if (view.hasFocus()) {
          view.focus();
        }
      }}
    />
  );
}

const NodeViewWrapper = memo(function NodeViewWrapper(props: {
  node: Node;
  contentDOM: HTMLElement | undefined;
  component: (props: ReactNodeViewProps) => ReactElement | null;
  hasNodeSelection: boolean;
  isNodeCompletelyWithinSelection: boolean;
}) {
  return (
    <props.component
      node={props.node}
      hasNodeSelection={props.hasNodeSelection}
      isNodeCompletelyWithinSelection={props.isNodeCompletelyWithinSelection}
      children={
        props.contentDOM ? <NodeViewContentDOM node={props.contentDOM} /> : null
      }
    />
  );
});

export function NodeViews(props: { state: EditorState }): ReactElement | null {
  const pluginState = reactNodeViewKey.getState(props.state);
  if (!pluginState) return null;
  const nodeSelectionPos =
    props.state.selection instanceof NodeSelection
      ? props.state.selection.from
      : undefined;
  const selectionFrom = props.state.selection.from;
  const selectionTo = props.state.selection.to;

  return (
    <>
      {[...pluginState].map(([pos, { key, contentDOM, dom, type }]) => {
        const node = props.state.doc.nodeAt(pos);
        if (node?.type !== type) return null;
        const nodeViewSpec = getReactNodeViewSpec(node.type);
        if (!nodeViewSpec) return null;
        return createPortal(
          <NodeViewWrapper
            hasNodeSelection={nodeSelectionPos === pos}
            isNodeCompletelyWithinSelection={
              pos >= selectionFrom && pos + node.nodeSize <= selectionTo
            }
            node={node}
            contentDOM={contentDOM}
            component={nodeViewSpec.component as any}
          />,
          dom,
          key
        );
      })}
    </>
  );
}

function getReactNodeViewSpec(type: NodeType): ReactNodeViewSpec | undefined {
  return type.spec.reactNodeView as ReactNodeViewSpec | undefined;
}

function createNodeView(type: NodeType): NodeViewInfo {
  const reactNodeViewSpec = getReactNodeViewSpec(type);
  return {
    key: (i++).toString(),
    type,
    dom: document.createElement('div'),
    contentDOM:
      reactNodeViewSpec?.rendersOwnContent || type.isLeaf
        ? undefined
        : document.createElement(type.inlineContent ? 'div' : 'span'),
  };
}

const reactNodeViewKey = new PluginKey<ReactNodeViewsState>('reactNodeViews');

export function reactNodeViews(schema: Schema) {
  const nodes = new Set<NodeType>();
  for (const nodeType of Object.values(schema.nodes)) {
    if (nodeType.spec.reactNodeView) {
      nodes.add(nodeType);
    }
  }
  const plugin: Plugin<ReactNodeViewsState> = new Plugin<ReactNodeViewsState>({
    key: reactNodeViewKey,
    state: {
      init(config, state) {
        const pluginState: ReactNodeViewsState = new Map();
        state.doc.descendants((node, pos) => {
          if (nodes.has(node.type)) {
            pluginState.set(pos, createNodeView(node.type));
          }
        });
        return pluginState;
      },
      apply(tr, oldPluginState, oldState, newState) {
        const mappedState: ReactNodeViewsState = new Map();
        for (const [position, val] of oldPluginState) {
          const mapped = tr.mapping.mapResult(position);
          if (mapped.deleted || mappedState.has(mapped.pos)) continue;
          const node = newState.doc.nodeAt(mapped.pos);
          if (!node || node.type !== val.type) continue;
          mappedState.set(mapped.pos, val);
        }
        const newPluginState: ReactNodeViewsState = new Map();
        newState.doc.descendants((node, pos) => {
          if (nodes.has(node.type)) {
            const key = mappedState.get(pos);
            newPluginState.set(pos, key ?? createNodeView(node.type));
          }
        });
        return newPluginState;
      },
    },
    props: {
      nodeViews: Object.fromEntries(
        [...nodes].map(node => [
          node.name,
          (node, view, getPos): NodeView => {
            const nodeView = plugin.getState(view.state)!.get(getPos()!);
            const contentDOM = nodeView!.contentDOM;
            return {
              dom: nodeView!.dom,
              contentDOM,
              ignoreMutation(mutation) {
                return !contentDOM?.contains(mutation.target);
              },
              deselectNode() {},
              selectNode() {},
              update() {
                const pos = getPos();
                const newNodeView = plugin
                  .getState(view.state)
                  ?.get(pos as number);
                return nodeView === newNodeView;
              },
            };
          },
        ])
      ),
    },
  });
  return plugin;
}
