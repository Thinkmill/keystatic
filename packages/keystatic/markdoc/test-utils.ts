import Markdoc from '@markdoc/markdoc';
import { Node } from 'slate';
import { makeEditor } from '../DocumentEditor/tests/utils';
import { ComponentBlock } from '../src';
import { ElementFromValidation } from '../structure-validation';
import { toMarkdocDocument } from './to-markdoc';

export function toMarkdoc(
  node: Node,
  componentBlocks: Record<string, ComponentBlock>
) {
  const { children } = makeEditor(node);
  return Markdoc.format(
    Markdoc.parse(
      Markdoc.format(
        toMarkdocDocument(children as ElementFromValidation[], componentBlocks)
      )
    )
  );
}
