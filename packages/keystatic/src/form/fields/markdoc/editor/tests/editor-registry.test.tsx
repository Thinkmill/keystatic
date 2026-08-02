/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { afterEach, expect, test } from '@jest/globals';
import {
  KEYSTATIC_EDITOR_MOUNTED_EVENT,
  KEYSTATIC_EDITOR_UNMOUNTED_EVENT,
  getEditor,
  getEditors,
  onEditorsChange,
  type KeystaticEditorEventDetail,
} from '../../../../../editor-registry';
import { jsx, renderEditor } from './utils';

function recordEvents() {
  const events: { type: string; key: string }[] = [];
  const listener = (event: Event) => {
    const { detail } = event as CustomEvent<KeystaticEditorEventDetail>;
    events.push({ type: event.type, key: detail.key });
  };
  document.addEventListener(KEYSTATIC_EDITOR_MOUNTED_EVENT, listener);
  document.addEventListener(KEYSTATIC_EDITOR_UNMOUNTED_EVENT, listener);
  cleanups.push(() => {
    document.removeEventListener(KEYSTATIC_EDITOR_MOUNTED_EVENT, listener);
    document.removeEventListener(KEYSTATIC_EDITOR_UNMOUNTED_EVENT, listener);
  });
  return events;
}

let cleanups: (() => void)[] = [];

afterEach(() => {
  for (const cleanup of cleanups) cleanup();
  cleanups = [];
});

test('an editor registers on mount and unregisters on unmount', () => {
  const events = recordEvents();
  expect(getEditors()).toHaveLength(0);

  const { rendered } = renderEditor(
    <doc>
      <paragraph>
        <text>
          hello
          <cursor />
        </text>
      </paragraph>
    </doc>
  );

  expect(events).toHaveLength(1);
  expect(events[0].type).toBe(KEYSTATIC_EDITOR_MOUNTED_EVENT);

  const key = events[0].key;
  const editor = getEditor(key);
  expect(editor).toBeDefined();
  // identity comparisons throughout: handles hold the EditorView, which is far
  // too large (and cyclic) for jest's structural matchers
  expect(getEditors()).toHaveLength(1);
  expect(getEditors()[0]).toBe(editor);

  // the key correlates with the editor's elements in the document
  expect(document.getElementById(editor!.rootElementId)).not.toBeNull();
  expect(document.getElementById(editor!.contentElementId)).toBe(
    rendered.baseElement.querySelector('[contenteditable="true"]')
  );

  rendered.unmount();

  expect(getEditor(key)).toBeUndefined();
  expect(getEditors()).toHaveLength(0);
  expect(events.map(e => e.type).join()).toBe(
    [KEYSTATIC_EDITOR_MOUNTED_EVENT, KEYSTATIC_EDITOR_UNMOUNTED_EVENT].join()
  );
});

test('the registered handle exposes a dispatchable view', () => {
  const events = recordEvents();
  const { state, rendered } = renderEditor(
    <doc>
      <paragraph>
        <text>
          hello
          <cursor />
        </text>
      </paragraph>
    </doc>
  );
  cleanups.push(() => rendered.unmount());

  const editor = getEditor(events[0].key)!;

  // `state` is live, not a snapshot taken at registration time
  expect(editor.state).toBe(editor.view.state);

  editor.dispatch(editor.state.tr.insertText(' world'));

  expect(editor.state.doc.textContent).toBe('hello world');
  // the transaction propagated back out through the editor's onChange
  expect(state().get().doc.textContent).toBe('hello world');
});

test('the registered handle can run commands and insert nodes', () => {
  const events = recordEvents();
  const { state, rendered } = renderEditor(
    <doc>
      <paragraph>
        <text>
          hello
          <cursor />
        </text>
      </paragraph>
    </doc>
  );
  cleanups.push(() => rendered.unmount());

  const editor = getEditor(events[0].key)!;

  expect(editor.runCommand(() => false)).toBe(false);
  expect(
    editor.runCommand((_state, dispatch) => {
      dispatch?.(_state.tr.insertText('!'));
      return true;
    })
  ).toBe(true);
  expect(editor.state.doc.textContent).toBe('hello!');

  editor.insertNode(editor.state.schema.nodes.divider.createChecked());

  expect(state()).toMatchInlineSnapshot(`
    <doc>
      <paragraph>
        <text>
          hello!
        </text>
      </paragraph>
      <node_selection>
        <divider />
      </node_selection>
    </doc>
  `);
});

test('onEditorsChange reports the current editors', () => {
  const seen: number[] = [];
  cleanups.push(onEditorsChange(editors => seen.push(editors.length)));

  expect(seen.join()).toBe('0');

  const { rendered } = renderEditor(
    <doc>
      <paragraph>
        <text>
          hello
          <cursor />
        </text>
      </paragraph>
    </doc>
  );

  expect(seen.join()).toBe('0,1');

  rendered.unmount();

  expect(seen.join()).toBe('0,1,0');
});
