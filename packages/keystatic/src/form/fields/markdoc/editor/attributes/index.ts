// https://github.com/ProseMirror/prosemirror-gapcursor/blob/bbbee7d483754310f63f3b18d81f5a1da1250234/src/index.ts
import { keydownHandler, keymap } from 'prosemirror-keymap';
import {
  NodeSelection,
  Plugin,
  EditorState,
  Transaction,
  AllSelection,
} from 'prosemirror-state';
import { EditorView, NodeViewConstructor } from 'prosemirror-view';

import { css, tokenSchema } from '@voussoir/style';
import { undo, redo } from 'prosemirror-history';
import { StepMap } from 'prosemirror-transform';
import { getAttributeType } from './schema';
import { selectAll } from 'prosemirror-commands';
import { nodeWithBorder } from '../utils';

export function attributes(): Plugin {
  return new Plugin({
    props: {
      handleKeyDown,
      nodeViews: {
        attribute: attributeNodeView,
      },
      handleClick(view, pos, event) {
        if (
          event.target instanceof HTMLElement &&
          event.target.dataset.tagName
        ) {
          const { state } = view;
          const $pos = state.doc.resolve(pos);
          const index = $pos.index(-2);
          const tagPos = state.doc.resolve(pos).posAtIndex(index, -2);
          view.dispatch(
            state.tr.setSelection(NodeSelection.create(state.doc, tagPos))
          );
          return true;
        }
        return false;
      },
    },
  });
}

const attributeNodeView: NodeViewConstructor = (node, outerView, getPos) => {
  const dom = document.createElement('span');
  dom.classList.add(
    css({
      display: 'inline-block',
      marginInline: 4,
      overflow: 'hidden',
      verticalAlign: 'middle',
      '::before': {
        paddingInline: tokenSchema.size.space.small,
        content: 'attr(data-markdoc-attribute)',
        display: 'inline-block',
        backgroundColor: tokenSchema.color.background.surfaceTertiary,
        borderRight: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
      },
    })
  );
  dom.classList.add(nodeWithBorder);
  dom.dataset.markdocAttribute =
    node.attrs.name === 'id'
      ? '#'
      : node.attrs.name === 'class'
      ? '.'
      : `${node.attrs.name}`;

  const inner = document.createElement('span');
  inner.className = css({
    minWidth: 50,
    display: 'inline-block',
    outline: 'none',
    backgroundColor: tokenSchema.color.background.canvas,
  });
  // to enter this via keyboard, users can press enter while in a node selection on the attribute in the parent document
  inner.tabIndex = -1;
  dom.appendChild(inner);

  const innerView = new EditorView(
    { mount: inner },
    {
      state: EditorState.create({
        doc: node,
        plugins: [
          keymap({
            'Mod-z': () => undo(outerView.state, outerView.dispatch),
            'Mod-y': () => redo(outerView.state, outerView.dispatch),
            Escape: () => {
              outerView.focus();
              outerView.dispatch(
                outerView.state.tr.setSelection(
                  NodeSelection.create(outerView.state.doc, getPos()!)
                )
              );
              return true;
            },
            'Mod-a': selectAll,
            Backspace: state => {
              if (state.selection instanceof AllSelection) {
                const pos = getPos()!;
                outerView.dispatch(
                  outerView.state.tr.delete(pos, pos + node.nodeSize)
                );
                outerView.focus();
                return true;
              }
              return false;
            },
          }),
        ],
      }),
      dispatchTransaction: (tr: Transaction) => {
        let { state, transactions } = innerView.state.applyTransaction(tr);
        innerView.updateState(state);
        if (!tr.getMeta('fromOutside')) {
          let outerTr = outerView.state.tr,
            offsetMap = StepMap.offset(getPos()! + 1);
          for (let i = 0; i < transactions.length; i++) {
            let steps = transactions[i].steps;
            for (let j = 0; j < steps.length; j++) {
              outerTr.step(steps[j].map(offsetMap)!);
            }
          }
          if (outerTr.docChanged) outerView.dispatch(outerTr);
        }
      },
      handleDOMEvents: {
        mousedown: () => {
          if (outerView.hasFocus()) innerView?.focus();
        },
      },
    }
  );
  domNodeToEditorView.set(dom, innerView);
  return {
    dom,
    selectNode() {
      dom.classList.add('ProseMirror-selectednode');
    },
    deselectNode() {
      dom.classList.remove('ProseMirror-selectednode');
    },
    update(newNode) {
      if (!node.sameMarkup(newNode)) return false;
      node = newNode;
      if (innerView) {
        let { state } = innerView;
        let start = newNode.content.findDiffStart(state.doc.content);
        if (start != null) {
          let { a: endA, b: endB } = newNode.content.findDiffEnd(
            state.doc.content
          )!;
          let overlap = start - Math.min(endA, endB);
          if (overlap > 0) {
            endA += overlap;
            endB += overlap;
          }
          innerView.dispatch(
            state.tr
              .replace(start, endB, newNode.slice(start, endA))
              .setMeta('fromOutside', true)
          );
        }
      }
      return true;
    },
    destroy() {
      innerView.destroy();
      dom.textContent = '';
    },

    stopEvent(event) {
      return innerView.dom.contains(event.target as Node);
    },
    ignoreMutation() {
      return true;
    },
  };
};

const handleKeyDown = keydownHandler({
  Enter: (state, dispatch, view) => {
    if (
      state.selection instanceof NodeSelection &&
      state.selection.node.type === getAttributeType(state.schema)
    ) {
      if (!view) return true;
      const node = view.nodeDOM(state.selection.$from.pos);
      if (!node) return true;
      const editorView = domNodeToEditorView.get(node);
      editorView?.focus();
      return true;
    }
    return false;
  },
});

export const domNodeToEditorView = new WeakMap<Node, EditorView>();
