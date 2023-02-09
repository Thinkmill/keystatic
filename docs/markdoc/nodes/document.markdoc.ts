import { Node, ValidationError, Schema, nodes } from '@markdoc/markdoc';
import { getIdForHeading } from './utils';

export const document: Schema = {
  ...nodes.document,
  validate(node) {
    const errors: ValidationError[] = [];
    // we want good stable ids so we require documentation authors write ids
    // when they could be ambiguous rather than just adding an index
    const seenHeadings = new Map<string, Node | 'reported'>();
    for (const child of node.children) {
      if (child.type === 'heading') {
        const id = getIdForHeading(child);
        // we report an error for this in the heading validation
        if (id.length === 0) {
          continue;
        }
        const existingHeading = seenHeadings.get(id);
        if (!existingHeading) {
          seenHeadings.set(id, child);
          continue;
        }
        const ambiguousHeadingError = (node: Node): ValidationError => ({
          id: 'ambiguous-heading-id',
          level: 'error',
          message: `The id for this heading is "${id}" which is the same as another heading in this file, disambiguate them with {% #some-id-here %} after a heading`,
          location: node.location,
        });
        if (existingHeading !== 'reported') {
          errors.push(ambiguousHeadingError(existingHeading));
          seenHeadings.set(id, 'reported');
        }
        errors.push(ambiguousHeadingError(child));
      }
    }
    return errors;
  },
};
