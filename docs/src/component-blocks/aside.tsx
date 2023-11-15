import { fields, component } from '@keystatic/core';

import { preview } from './aside.preview';

export const schema = {
  icon: fields.text({
    label: 'Emoji icon...',
  }),
  content: fields.child({
    kind: 'block',
    editIn: 'both',
    label: 'Content',
    placeholder: 'Aside...',
    formatting: {
      inlineMarks: 'inherit',
      softBreaks: 'inherit',
      listTypes: 'inherit',
    },
    links: 'inherit',
  }),
};

export const aside = component({
  label: 'Aside',
  schema,
  preview,
});
