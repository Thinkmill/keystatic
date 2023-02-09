import { Tag, Schema, ValidationError } from '@markdoc/markdoc';
import { getIdForHeading } from './utils';

export const heading: Schema = {
  render: 'Heading',
  children: ['inline'],
  attributes: {
    id: { type: String },
    level: { type: Number, required: true },
  },
  validate(node) {
    const errors: ValidationError[] = [];
    if (node.attributes.level === 1) {
      errors.push({
        message:
          "H1's are not allowed, specify the title in frontmatter at the top of the file if you're trying to specify the page title, otherwise use a different heading level",
        id: 'no-h1',
        level: 'error',
      });
    }
    const id = getIdForHeading(node);
    if (id.length === 0) {
      errors.push({
        id: 'empty-id',
        level: 'error',
        message:
          'This heading has an empty id, change the heading content so that a non-empty id is generated or add {% #some-id %} after the heading',
      });
    }
    return errors;
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    return new Tag(
      this.render,
      { ...attributes, id: getIdForHeading(node) },
      children
    );
  },
};
