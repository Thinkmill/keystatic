'use client';
import { FieldPrimitive } from '@keystar/ui/field';
import { FormFieldInputProps } from '../../api';
import { Editor } from './editor';
import { EditorSchema } from './editor/schema';
import React, { ReactNode, useMemo, useState } from 'react';
import Markdoc from '@markdoc/markdoc';
import { createEditorState } from './editor/editor-state';
import { markdocToProseMirror } from './editor/markdoc/parse';
import { proseMirrorToMarkdoc } from './editor/markdoc/serialize';
import weakMemoize from '@emotion/weak-memoize';
import { Node } from 'prosemirror-model';
import { MarkdocCodeEditor } from './code-editor';
import { TabList, Item, TabPanels, Tabs } from '@keystar/ui/tabs';
import { createPatch } from 'diff';
import { Notice } from '@keystar/ui/notice';
import { syntaxOnlyMarkdocValidate } from './editor/utils';
import { Text } from '@keystar/ui/typography';

const serializeDoc = weakMemoize(function serializeState(node: Node) {
  return Markdoc.format(
    Markdoc.parse(Markdoc.format(proseMirrorToMarkdoc(node)))
  );
});

function RichTextEditor(props: {
  value: string;
  onChange: (value: string) => void;
  editorSchema: EditorSchema;
}) {
  const parsedVal = useMemo(() => Markdoc.parse(props.value), [props.value]);
  const valueAsProseMirrorDoc = useMemo(
    () => markdocToProseMirror(parsedVal, props.editorSchema),
    [props.editorSchema, parsedVal]
  );

  const serializedFromValue = serializeDoc(valueAsProseMirrorDoc);
  const formattedParsed = Markdoc.format(parsedVal);
  if (serializedFromValue !== formattedParsed) {
    const patch = createPatch('markdoc', formattedParsed, serializedFromValue);
    throw new Error('failed to round trip markdoc. diff:\n' + patch);
  }

  const [editorState, setEditorState] = useState(() => {
    const doc = markdocToProseMirror(parsedVal, props.editorSchema);
    return createEditorState(doc);
  });
  const serialized = serializeDoc(editorState.doc);
  if (serialized !== serializeDoc(valueAsProseMirrorDoc)) {
    setEditorState(
      createEditorState(markdocToProseMirror(parsedVal, props.editorSchema))
    );
  }
  return (
    <>
      <Editor
        value={editorState}
        onChange={state => {
          setEditorState(state);
          props.onChange(serializeDoc(state.doc));
        }}
      />
    </>
  );
}

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { error: null | { val: unknown } }
> {
  state: { error: null | { val: unknown } } = {
    error: null,
  };
  static getDerivedStateFromError(error: unknown) {
    return { error: { val: error } };
  }
  render() {
    if (this.state.error) {
      return (
        <Notice>
          Something went wrong! This means there's likely something that can be
          improved in Keystatic.
          <pre>
            {(() => {
              try {
                return this.state.error.val instanceof Error &&
                  this.state.error.val.stack
                  ? String(this.state.error.val.stack)
                  : String(this.state.error);
              } catch (err) {
                try {
                  console.error(err);
                } catch {}
                return 'something went wrong while rendering the error message';
              }
            })()}
          </pre>
          {}
        </Notice>
      );
    }
    return this.props.children;
  }
}

export function DocumentFieldInput(
  props: FormFieldInputProps<string> & {
    label: string;
    description: string | undefined;
    editorSchema: EditorSchema;
  }
) {
  const parsed = useMemo(() => {
    const ast = Markdoc.parse(props.value);
    return {
      ast,
      syntaxErrors: syntaxOnlyMarkdocValidate(ast),
      allErrors: Markdoc.validate(ast, props.editorSchema.markdocConfig),
    };
  }, [props.editorSchema.markdocConfig, props.value]);

  return (
    <FieldPrimitive label={props.label} description={props.description}>
      <Tabs>
        <TabList>
          <Item key="rich-text">Rich Text</Item>
          <Item key="code">
            <Text>Code {parsed.allErrors.length ? '(Errors)' : null}</Text>
          </Item>
        </TabList>
        <TabPanels>
          <Item key="rich-text">
            <ErrorBoundary>
              {parsed.syntaxErrors.length ? (
                <Notice tone="caution">
                  This content has syntax errors so this editor isn't available.
                  Please go to the code tab to fix the syntax errors.
                </Notice>
              ) : (
                <RichTextEditor
                  value={props.value}
                  onChange={props.onChange}
                  editorSchema={props.editorSchema}
                />
              )}
            </ErrorBoundary>
          </Item>
          <Item key="code">
            <ErrorBoundary>
              <MarkdocCodeEditor
                value={props.value}
                onChange={props.onChange}
                config={props.editorSchema.markdocConfig}
              />
            </ErrorBoundary>
          </Item>
        </TabPanels>
      </Tabs>
    </FieldPrimitive>
  );
}
