import Markdoc from '@markdoc/markdoc';
import { Node } from 'slate';
import {
  defaultDocumentFeatures,
  makeEditor,
} from '../DocumentEditor/tests/utils';
import { ComponentBlock } from '../src';
import { toMarkdocDocument } from './to-markdoc';

export function toMarkdoc(
  node: Node,
  componentBlocks: Record<string, ComponentBlock>
) {
  const { children } = makeEditor(node);
  return Markdoc.format(
    Markdoc.parse(
      Markdoc.format(
        toMarkdocDocument(children, {
          componentBlocks,
          documentFeatures: defaultDocumentFeatures,
        })
      )
    )
  );
}
