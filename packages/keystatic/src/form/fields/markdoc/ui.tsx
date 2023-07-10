'use client';
import { FieldPrimitive } from '@keystar/ui/field';
import { FormFieldInputProps } from '../../api';
import { EditorState } from 'prosemirror-state';
import { Editor } from './editor';

export function DocumentFieldInput(
  props: FormFieldInputProps<EditorState> & {
    label: string;
    description: string | undefined;
  }
) {
  return (
    <FieldPrimitive label={props.label} description={props.description}>
      <Editor value={props.value} onChange={props.onChange} />
    </FieldPrimitive>
  );
}
