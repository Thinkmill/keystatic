/** @vitest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { fireEvent } from '@testing-library/react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { afterEach, expect, test, vi } from 'vitest';
import { jsx, renderEditor } from './utils';

afterEach(() => {
  vi.restoreAllMocks();
});

test('renders empty editor placeholder on the textblock node instead of a widget child span', async () => {
  const { contentElement, state, user } = renderEditor(
    <doc>
      <paragraph>
        <cursor />
      </paragraph>
    </doc>
  );

  const paragraph = contentElement.querySelector('p');
  expect(paragraph).not.toBeNull();
  expect(paragraph!.classList.contains('ProseMirror-placeholder')).toBe(true);
  expect(paragraph!.getAttribute('data-placeholder')).toBe(
    'Start writing or press "/" for commands…'
  );
  expect(
    contentElement.querySelector('span.ProseMirror-placeholder')
  ).toBeNull();

  const removedPlaceholderSpans: Node[] = [];
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const removed of Array.from(mutation.removedNodes)) {
        if (
          removed instanceof HTMLElement &&
          removed.classList.contains('ProseMirror-placeholder')
        ) {
          removedPlaceholderSpans.push(removed);
        }
      }
    }
  });
  observer.observe(paragraph!, { childList: true, subtree: true });

  fireEvent.compositionStart(contentElement);
  await user.keyboard('n');
  fireEvent.compositionEnd(contentElement, { data: 'n' });
  await Promise.resolve();
  observer.disconnect();

  expect(removedPlaceholderSpans).toHaveLength(0);
  expect(paragraph!.classList.contains('ProseMirror-placeholder')).toBe(false);
  expect(paragraph!.hasAttribute('data-placeholder')).toBe(false);
  expect(state()).toEqual(
    <doc>
      <paragraph>
        <text>
          n<cursor />
        </text>
      </paragraph>
    </doc>
  );

  await user.keyboard('{Backspace}');
  expect(paragraph!.classList.contains('ProseMirror-placeholder')).toBe(true);
  expect(paragraph!.getAttribute('data-placeholder')).toBe(
    'Start writing or press "/" for commands…'
  );
});

test('does not redundantly call view.updateState when React re-renders with the same dispatched state', async () => {
  const updateStateSpy = vi.spyOn(EditorView.prototype, 'updateState');

  const { user } = renderEditor(
    <doc>
      <paragraph>
        <cursor />
      </paragraph>
    </doc>
  );

  updateStateSpy.mockClear();

  await user.keyboard('a');

  // dispatchTransaction calls updateState once; the React useLayoutEffect should
  // not call updateState a second time for the exact same EditorState instance.
  expect(updateStateSpy).toHaveBeenCalledTimes(1);
  expect(updateStateSpy.mock.calls[0][0]).toBeInstanceOf(EditorState);
});
