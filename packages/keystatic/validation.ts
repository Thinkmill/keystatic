import { Text, Editor, Descendant } from 'slate';
import { createDocumentEditorWithoutReact } from './DocumentEditor';
import { ComponentBlock } from './DocumentEditor/component-blocks/api';
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
  componentBlocks: Record<string, ComponentBlock>
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
          [],
          undefined
        ),
      };
    }
  }
  if (node.type === 'image') {
    return node;
  }
  return {
    ...node,
    children: node.children.map(x =>
      getValidatedNodeWithNormalizedComponentFormProps(x, componentBlocks)
    ),
  };
}

export function validateAndNormalizeDocument(
  value: unknown,
  documentFeatures: DocumentFeatures,
  componentBlocks: Record<string, ComponentBlock>
) {
  validateDocumentStructure(value);
  const children = value.map(x =>
    getValidatedNodeWithNormalizedComponentFormProps(x, componentBlocks)
  );
  const editor = createDocumentEditorWithoutReact(
    documentFeatures,
    componentBlocks
  );
  editor.children = children as Descendant[];
  Editor.normalize(editor, { force: true });
  return editor.children;
}
