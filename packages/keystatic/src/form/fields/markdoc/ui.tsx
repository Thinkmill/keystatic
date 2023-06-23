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
  const valueAsProseMirrorDoc = useMemo(
    () => markdocToProseMirror(Markdoc.parse(props.value), props.editorSchema),
    [props.editorSchema, props.value]
  );
  const [editorState, setEditorState] = useState(() => {
    const doc = markdocToProseMirror(
      Markdoc.parse(props.value),
      props.editorSchema
    );
    return createEditorState(doc);
  });
  const serialized = serializeDoc(editorState.doc);
  if (serialized !== serializeDoc(valueAsProseMirrorDoc)) {
    setEditorState(
      createEditorState(
        markdocToProseMirror(Markdoc.parse(props.value), props.editorSchema)
      )
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
        <div>
          Something went wrong.
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
        </div>
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
  return (
    <FieldPrimitive label={props.label} description={props.description}>
      <Tabs aria-label="Tabs example">
        <TabList>
          <Item key="rich-text">Rich Text</Item>
          <Item key="code">Code</Item>
        </TabList>
        <TabPanels>
          <Item key="rich-text">
            <ErrorBoundary>
              <RichTextEditor
                value={props.value}
                onChange={props.onChange}
                editorSchema={props.editorSchema}
              />
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
