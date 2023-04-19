'use client';
import { FieldPrimitive } from '@keystar-ui/field';
import { DocumentEditor } from './DocumentEditor';
import {
  ComponentBlock,
  DocumentElement,
  FormFieldInputProps,
} from '../../api';
import { DocumentFeatures } from './DocumentEditor/document-features';

export function DocumentFieldInput(
  props: FormFieldInputProps<DocumentElement[]> & {
    label: string;
    description: string | undefined;
    componentBlocks: Record<string, ComponentBlock>;
    documentFeatures: DocumentFeatures;
  }
) {
  return (
    <FieldPrimitive label={props.label} description={props.description}>
      <DocumentEditor
        componentBlocks={props.componentBlocks}
        documentFeatures={props.documentFeatures}
        onChange={props.onChange as any}
        value={props.value as any}
      />
    </FieldPrimitive>
  );
}
