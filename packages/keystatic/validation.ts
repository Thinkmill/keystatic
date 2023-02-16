import { Text, Editor } from 'slate';
import { createDocumentEditor } from './DocumentEditor';
import { ComponentBlock } from './DocumentEditor/component-blocks/api';
import { Relationships } from './DocumentEditor/relationship';
import {
  ElementFromValidation,
  TextWithMarks,
  validateDocumentStructure,
} from './structure-validation';
import { DocumentFeatures } from './DocumentEditor/document-features';
import { validateComponentBlockProps } from './validate-component-block-props';

function isText(node: ElementFromValidation): node is TextWithMarks {
  return Text.isText(node);
}

// note that the errors thrown from here will only be exposed
// as internal server error from the graphql api in prod
// this is fine because these cases are pretty much all about
// malicious content being inserted, not valid content
export function getValidatedNodeWithNormalizedComponentFormProps(
  node: ElementFromValidation,
  componentBlocks: Record<string, ComponentBlock>,
  relationships: Relationships
): ElementFromValidation {
  if (isText(node)) {
    return node;
  }
  if (node.type === 'component-block') {
    if (componentBlocks.hasOwnProperty(node.component)) {
      const componentBlock = componentBlocks[node.component];
      node = {
        ...node,
        props: validateComponentBlockProps(
          { kind: 'object', fields: componentBlock.schema },
          node.props,
          relationships,
          []
        ),
      };
    }
  }

  if (node.type === 'relationship') {
    node = {
      type: 'relationship',
      data:
        node.data?.id !== undefined
          ? { id: node.data.id, data: undefined, label: undefined }
          : null,
      relationship: node.relationship,
      children: node.children,
    };
  }
  return {
    ...node,
    children: node.children.map(x =>
      getValidatedNodeWithNormalizedComponentFormProps(
        x,
        componentBlocks,
        relationships
      )
    ),
  };
}

export function validateAndNormalizeDocument(
  value: unknown,
  documentFeatures: DocumentFeatures,
  componentBlocks: Record<string, ComponentBlock>,
  relationships: Relationships
) {
  validateDocumentStructure(value);
  const children = value.map(x =>
    getValidatedNodeWithNormalizedComponentFormProps(
      x,
      componentBlocks,
      relationships
    )
  );
  const editor = createDocumentEditor(
    documentFeatures,
    componentBlocks,
    relationships
  );
  editor.children = children;
  Editor.normalize(editor, { force: true });
  return editor.children;
}
