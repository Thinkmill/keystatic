import type { Node } from 'prosemirror-model';
import type { Command, EditorState, Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

/**
 * A narrow, framework-agnostic command surface over a mounted ProseMirror
 * editor. Handles are only valid while the editor they refer to is mounted;
 * always re-read them from {@link getEditor} rather than holding onto one.
 */
export type KeystaticEditorHandle = {
  /** Stable for the lifetime of the mounted editor. */
  readonly key: string;
  /** The field label the editor was rendered for, when one is available. */
  readonly label: string | undefined;
  /** The id of the editor's root element in the document. */
  readonly rootElementId: string;
  /** The id of the editor's contenteditable element in the document. */
  readonly contentElementId: string;
  /** Escape hatch for callers that need the full ProseMirror API. */
  readonly view: EditorView;
  /** The editor's current state. Re-read on every access. */
  readonly state: EditorState;
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

export type KeystaticEditorEventDetail = { key: string };

/**
 * Dispatched on `document` when an editor registers itself. The `key` in
 * `detail` can be passed to {@link getEditor}.
 */
export const KEYSTATIC_EDITOR_MOUNTED_EVENT = 'keystatic:editor-mounted';

/** Dispatched on `document` when an editor tears down. */
export const KEYSTATIC_EDITOR_UNMOUNTED_EVENT = 'keystatic:editor-unmounted';

const editors = new Map<string, KeystaticEditorHandle>();
const listeners = new Set<(editors: KeystaticEditorHandle[]) => void>();

function emit(type: string, key: string) {
  for (const listener of [...listeners]) {
    listener([...editors.values()]);
  }
  if (typeof document === 'undefined') return;
  document.dispatchEvent(
    new CustomEvent<KeystaticEditorEventDetail>(type, { detail: { key } })
  );
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
 */
export function onEditorsChange(
  listener: (editors: KeystaticEditorHandle[]) => void
): () => void {
  listeners.add(listener);
  listener([...editors.values()]);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Registers a mounted editor. Called by the editor view on mount; the returned
 * function unregisters it and must be called on unmount.
 */
export function registerEditor(
  key: string,
  view: EditorView,
  meta: {
    label: string | undefined;
    rootElementId: string;
    contentElementId: string;
  }
): () => void {
  const handle: KeystaticEditorHandle = {
    key,
    label: meta.label,
    rootElementId: meta.rootElementId,
    contentElementId: meta.contentElementId,
    view,
    get state() {
      return view.state;
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
  emit(KEYSTATIC_EDITOR_MOUNTED_EVENT, key);
  return () => {
    if (editors.get(key) !== handle) return;
    editors.delete(key);
    emit(KEYSTATIC_EDITOR_UNMOUNTED_EVENT, key);
  };
}
