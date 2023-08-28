import { fields, component } from '@keystatic/core';

import { preview } from './tags.preview';

export const schema = {
  tags: fields.multiselect({
    label: 'Project tags',
    options: [
      { label: 'Local', value: 'Local' },
      { label: 'Github', value: 'github' },
      { label: 'New project', value: 'New project' },
      { label: 'Existing project', value: 'Existing project' },
      { label: 'Astro', value: 'Astro' },
      { label: 'Next.js', value: 'Next.js' },
    ],
  }),
};

export const tags = component({
  label: 'Project',
  schema,
  preview,
  chromeless: false,
});
