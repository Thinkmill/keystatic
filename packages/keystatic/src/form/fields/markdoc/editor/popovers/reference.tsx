import { ReferenceElement } from '@floating-ui/react';
import { useLayoutEffect, useState } from 'react';
import { useEditorViewInEffect } from '../editor-view';
import { EditorView } from 'prosemirror-view';

function getReferenceElementForRange(
  view: EditorView,
  from: number,
  to: number
): ReferenceElement | null {
  const nodeAtFrom = view.state.doc.nodeAt(from);
  if (nodeAtFrom !== null && to === from + nodeAtFrom.nodeSize) {
    const node = view.nodeDOM(from);
    if (node instanceof Element) {
      return node;
    }
  }
  const fromDom = view.domAtPos(from);
  const toDom = view.domAtPos(to);
  const range = document.createRange();
  range.setStart(fromDom.node, fromDom.offset);
  range.setEnd(toDom.node, toDom.offset);
  return range;
}

export function useEditorReferenceElement(
  from: number,
  to: number
): ReferenceElement | null {
  const [referenceElement, setReferenceElement] =
    useState<ReferenceElement | null>(null);
  const getEditorView = useEditorViewInEffect();
  useLayoutEffect(() => {
    const view = getEditorView();
    if (!view) {
      setReferenceElement(null);
      return;
    }
    setReferenceElement(getReferenceElementForRange(view, from, to));
  }, [getEditorView, from, to]);
  return referenceElement;
}
