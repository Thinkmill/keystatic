import { format, parse } from '#markdoc';
import { Node } from 'slate';
import {
  defaultDocumentFeatures,
  makeEditor,
} from '../DocumentEditor/tests/utils';
import { ComponentBlock } from '../../../..';
import { toMarkdocDocument } from './to-markdoc';

export function toMarkdoc(
  node: Node,
  componentBlocks: Record<string, ComponentBlock>
) {
  const { children } = makeEditor(node);
  const root = toMarkdocDocument(children, {
    componentBlocks,
    documentFeatures: defaultDocumentFeatures,
    slug: undefined,
  }).node;
  return format(parse(format(root)));
}
