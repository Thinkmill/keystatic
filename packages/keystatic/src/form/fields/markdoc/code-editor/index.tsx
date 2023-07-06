import { useLayoutEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import {
  EditorView,
  drawSelection,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
  LanguageDescription,
  defaultHighlightStyle,
  syntaxHighlighting,
} from '@codemirror/language';
import { markdown } from '@codemirror/lang-markdown';
import { useEventCallback } from '../editor/utils';
import Markdoc, { Config } from '@markdoc/markdoc';
import { linter, Diagnostic, lintGutter } from '@codemirror/lint';

function createState(
  value: string,
  onChange: (value: string) => void,
  config: Config
) {
  return EditorState.create({
    doc: value,
    extensions: [
      lineNumbers(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      syntaxHighlighting(defaultHighlightStyle),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      markdown({
        codeLanguages: [
          LanguageDescription.of({
            name: 'javascript',
            alias: ['js'],
            load: () =>
              import('@codemirror/lang-javascript').then(x => x.javascript()),
          }),
          LanguageDescription.of({
            name: 'jsx',
            load: () =>
              import('@codemirror/lang-javascript').then(x =>
                x.javascript({ jsx: true })
              ),
          }),
          LanguageDescription.of({
            name: 'typescript',
            alias: ['ts'],
            load: () =>
              import('@codemirror/lang-javascript').then(x =>
                x.javascript({ typescript: true })
              ),
          }),
          LanguageDescription.of({
            name: 'tsx',
            load: () =>
              import('@codemirror/lang-javascript').then(x =>
                x.javascript({ typescript: true, jsx: true })
              ),
          }),
        ],
      }),
      EditorView.updateListener.of(update => {
        onChange(update.state.doc.toString());
      }),
      linter(
        view => {
          let diagnostics: Diagnostic[] = [];
          const doc = view.state.doc;

          const markdoc = Markdoc.parse(doc.toString());
          const errors = Markdoc.validate(markdoc, config);
          for (const err of errors) {
            let severity: Diagnostic['severity'] = 'error';
            if (err.error.level === 'warning') {
              severity = 'warning';
            }
            if (err.error.level === 'info' || err.error.level === 'debug') {
              severity = 'info';
            }
            diagnostics.push({
              from: doc.line(err.lines[0] + 1).from,
              to: doc.line(err.lines[1] + 1).to,
              message: err.error.message,
              severity,
            });
          }
          return diagnostics;
        },
        { delay: 300 }
      ),
      lintGutter(),
    ],
  });
}

export function MarkdocCodeEditor(props: {
  value: string;
  onChange: (value: string) => void;
  config: Config;
}) {
  const ref = useRef<EditorView | null>(null);

  const onChange = useEventCallback((val: string) => {
    props.onChange(val);
  });

  useLayoutEffect(() => {
    const view = ref.current!;
    if (view.state.doc.toString() !== props.value) {
      view.setState(createState(props.value, onChange, props.config));
    }
  });

  return (
    <div
      ref={useEventCallback((parent: HTMLDivElement | null) => {
        if (ref.current) {
          ref.current.destroy();
          ref.current = null;
        }
        if (parent) {
          ref.current = new EditorView({
            state: createState(props.value, onChange, props.config),
            parent,
          });
        }
      })}
    />
  );
}
