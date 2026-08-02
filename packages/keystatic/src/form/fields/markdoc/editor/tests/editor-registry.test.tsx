/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { afterEach, expect, jest, test } from '@jest/globals';
import {
  getEditor,
  getEditors,
  onEditorsChange,
  type KeystaticEditorHandle,
} from '../../../../../editor-registry';
import { jsx, renderEditor } from './utils';

let cleanups: (() => void)[] = [];

afterEach(() => {
  for (const cleanup of cleanups) cleanup();
  cleanups = [];
  expect(keys()).toBe('');
});

/**
 * Handles hold the EditorView, which is far too large (and cyclic) for jest's
 * structural matchers, and the shared editor-state equality tester in `./utils`
 * makes `toEqual` unusable here — compare joined keys, or identity with `toBe`.
 */
const keys = () =>
  getEditors()
    .map(editor => editor.key)
    .join();

/** Records every set of editors `onEditorsChange` reports, keys only. */
function recordChanges() {
  const seen: string[] = [];
  cleanups.push(
    onEditorsChange(editors =>
      seen.push(editors.map(editor => editor.key).join())
    )
  );
  return seen;
}

const hello = (
  <doc>
    <paragraph>
      <text>
        hello
        <cursor />
      </text>
    </paragraph>
  </doc>
);

test('an editor with an editorKey registers on mount and unregisters on unmount', () => {
  const seen = recordChanges();
  expect(keys()).toBe('');

  const { rendered } = renderEditor(hello, { editorKey: 'content' });

  expect(keys()).toBe('content');
  const editor = getEditor('content');
  expect(getEditors()[0]).toBe(editor);

  // the handle exposes the editor's live elements, not ids that need resolving
  expect(editor!.contentElement).toBe(
    rendered.baseElement.querySelector('[contenteditable="true"]')
  );
  expect(editor!.rootElement).toBe(
    rendered.baseElement.querySelector('[data-keystatic-editor="root"]')
  );

  rendered.unmount();

  expect(getEditor('content')).toBeUndefined();
  // (mount counts differ under STRICT_MODE=1; the exact sequence is asserted by
  // the dedicated StrictMode test below)
  expect(seen[0]).toBe('');
  expect(seen).toContain('content');
  expect(seen[seen.length - 1]).toBe('');
});

test('an editor without an editorKey does not register', () => {
  const seen = recordChanges();

  const { rendered } = renderEditor(hello);
  cleanups.push(() => rendered.unmount());

  expect(keys()).toBe('');
  expect(seen.join('|')).toBe('');
});

test('registration survives a StrictMode double-mount', () => {
  const seen = recordChanges();

  const { rendered } = renderEditor(hello, {
    editorKey: 'content',
    strictMode: true,
  });

  // StrictMode mounts, unmounts and remounts the effect that creates the view;
  // exactly one editor must be left registered, holding the surviving view
  expect(keys()).toBe('content');
  const editor = getEditor('content')!;
  expect(editor.contentElement).toBe(
    rendered.baseElement.querySelector('[contenteditable="true"]')
  );
  expect(editor.state).toBe(editor.view.state);

  editor.dispatch(editor.state.tr.insertText('!'));
  expect(editor.state.doc.textContent).toBe('hello!');

  rendered.unmount();

  expect(keys()).toBe('');
  // register / unregister / register / unregister: the double-mount is
  // observable to subscribers, but it never leaves a stale registration
  expect(seen.join('|')).toBe('|content||content|');
});

test('a duplicate editorKey logs an error and the last registration wins', () => {
  const error = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {}) as unknown as {
    mock: { calls: unknown[][] };
    mockRestore(): void;
  };
  cleanups.push(() => error.mockRestore());

  const first = renderEditor(hello, { editorKey: 'dupe' });
  const firstHandle = getEditor('dupe')!;
  expect(error.mock.calls).toHaveLength(0);

  const second = renderEditor(hello, { editorKey: 'dupe' });

  expect(error.mock.calls).toHaveLength(1);
  expect(String(error.mock.calls[0][0])).toContain(
    'Duplicate Keystatic editorKey "dupe"'
  );

  const secondHandle = getEditor('dupe')!;
  expect(secondHandle).not.toBe(firstHandle);
  expect(keys()).toBe('dupe');

  // unmounting the displaced editor must not remove the one that replaced it
  first.rendered.unmount();
  expect(getEditor('dupe')).toBe(secondHandle);

  second.rendered.unmount();
  expect(keys()).toBe('');
});

test('the registered handle exposes a dispatchable view', () => {
  const { state, rendered } = renderEditor(hello, { editorKey: 'content' });
  cleanups.push(() => rendered.unmount());

  const editor = getEditor('content')!;

  // `state` is live, not a snapshot taken at registration time
  expect(editor.state).toBe(editor.view.state);

  editor.dispatch(editor.state.tr.insertText(' world'));

  expect(editor.state.doc.textContent).toBe('hello world');
  // the transaction propagated back out through the editor's onChange
  expect(state().get().doc.textContent).toBe('hello world');
});

test('the registered handle can run commands and insert nodes', () => {
  const { state, rendered } = renderEditor(hello, { editorKey: 'content' });
  cleanups.push(() => rendered.unmount());

  const editor = getEditor('content')!;

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

test('a throwing subscriber neither skips other subscribers nor breaks the editor', () => {
  const error = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {}) as unknown as {
    mock: { calls: unknown[][] };
    mockRestore(): void;
  };
  cleanups.push(() => error.mockRestore());

  const before: string[] = [];
  const after: string[] = [];
  const record = (into: string[]) => (editors: KeystaticEditorHandle[]) =>
    into.push(editors.map(handle => handle.key).join());
  cleanups.push(onEditorsChange(record(before)));
  cleanups.push(
    onEditorsChange(() => {
      throw new Error('subscriber exploded');
    })
  );
  cleanups.push(onEditorsChange(record(after)));

  // the immediate call to the throwing subscriber is caught too
  expect(error.mock.calls).toHaveLength(1);

  const { rendered } = renderEditor(hello, { editorKey: 'content' });

  // the later subscriber still ran, and the mount effect completed
  expect(after[after.length - 1]).toBe('content');
  expect(before.length).toBe(after.length);
  expect(getEditor('content')).toBeDefined();

  // and unmount — which runs in the same effect cleanup — still tears down
  rendered.unmount();

  expect(keys()).toBe('');
  expect(after[after.length - 1]).toBe('');
});
