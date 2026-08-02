import type { Node } from 'prosemirror-model';
import type { Command, EditorState, Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

/**
 * A narrow, framework-agnostic command surface over a mounted ProseMirror
 * editor. Handles are only valid while the editor they refer to is mounted;
 * always re-read them from {@link getEditor} rather than holding onto one.
 */
export type KeystaticEditorHandle = {
  /**
   * The `editorKey` the field was configured with. Stable for the lifetime of
   * the mounted editor.
   */
  readonly key: string;
  /** Escape hatch for callers that need the full ProseMirror API. */
  readonly view: EditorView;
  /** The editor's current state. Re-read on every access. */
  readonly state: EditorState;
  /**
   * The editor's `contenteditable` element — the same node as `view.dom`.
   * Re-read on every access.
   */
  readonly contentElement: HTMLElement;
  /**
   * The editor's root element (the one carrying
   * `data-keystatic-editor="root"`), which contains the toolbar as well as the
   * content. `null` if the editor has been detached from the document.
   * Re-read on every access.
   */
  readonly rootElement: HTMLElement | null;
  dispatch(tr: Transaction): void;
  /** Runs a ProseMirror command, returning whether it applied. */
  runCommand(command: Command): boolean;
  focus(): void;
  /**
   * Inserts a node at `at`, or over the current selection when `at` is
   * omitted.
   */
  insertNode(node: Node, options?: { at?: number }): void;
};

const editors = new Map<string, KeystaticEditorHandle>();
const listeners = new Set<(editors: KeystaticEditorHandle[]) => void>();

function emit() {
  const snapshot = [...editors.values()];
  for (const listener of [...listeners]) {
    try {
      listener(snapshot);
    } catch (error) {
      // a throwing subscriber must not skip the remaining subscribers, nor
      // propagate into the editor's mount/unmount effect
      console.error(error);
    }
  }
}

/** Returns the handle for `key`, or undefined when no such editor is mounted. */
export function getEditor(key: string): KeystaticEditorHandle | undefined {
  return editors.get(key);
}

/** Returns handles for every currently mounted editor, in mount order. */
export function getEditors(): KeystaticEditorHandle[] {
  return [...editors.values()];
}

/**
 * Subscribes to mount/unmount changes. The listener is called immediately with
 * the current set of editors. Returns an unsubscribe function.
 *
 * Exceptions thrown by a listener are caught and logged; they never reach the
 * editor that triggered the change.
 */
export function onEditorsChange(
  listener: (editors: KeystaticEditorHandle[]) => void
): () => void {
  listeners.add(listener);
  try {
    listener([...editors.values()]);
  } catch (error) {
    console.error(error);
  }
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Registers a mounted editor under `key`. Called by the editor view on mount
 * when — and only when — the field was configured with an `editorKey`; the
 * returned function unregisters it and must be called on unmount.
 *
 * Registering a `key` that is already taken replaces the existing handle (last
 * write wins) and logs an error: keys are expected to be unique across the
 * mounted form. The displaced editor's unregister function becomes a no-op, so
 * unmounting it will not remove the editor that replaced it.
 */
export function registerEditor(key: string, view: EditorView): () => void {
  if (editors.has(key)) {
    console.error(
      `Duplicate Keystatic editorKey ${JSON.stringify(
        key
      )}: the editor registered later replaces the earlier one. editorKey must be unique across mounted editors.`
    );
  }
  const handle: KeystaticEditorHandle = {
    key,
    view,
    get state() {
      return view.state;
    },
    get contentElement() {
      return view.dom as HTMLElement;
    },
    get rootElement() {
      return (view.dom as HTMLElement).closest<HTMLElement>(
        '[data-keystatic-editor="root"]'
      );
    },
    dispatch(tr) {
      view.dispatch(tr);
    },
    runCommand(command) {
      return command(view.state, view.dispatch, view);
    },
    focus() {
      view.focus();
    },
    insertNode(node, options) {
      const at = options?.at;
      view.dispatch(
        at === undefined
          ? view.state.tr.replaceSelectionWith(node)
          : view.state.tr.insert(at, node)
      );
    },
  };
  editors.set(key, handle);
  emit();
  return () => {
    if (editors.get(key) !== handle) return;
    editors.delete(key);
    emit();
  };
}
