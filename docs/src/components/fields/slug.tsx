'use client';

import slugify from '@sindresorhus/slugify';
import { FieldDemoFrame } from './frame';
import { SlugFieldInput } from '../../../../packages/keystatic/src/form/fields/slug/ui';
import { useState } from 'react';

export const SlugFieldDemo = () => {
  const args = {
    name: {
      label: 'Title',
      description: 'The title of the post',
      defaultValue: 'My first post',
    },
    slug: {
      label: 'SEO-friendly slug',
      description: 'This will define the file/folder name for this entry',
    },
  };
  const naiveGenerateSlug: (name: string) => string = slugify;
  const defaultValue = {
    name: args.name.defaultValue ?? '',
    slug: naiveGenerateSlug(args.name.defaultValue ?? ''),
  };
  const [value, setValue] = useState(defaultValue);

  return (
    <FieldDemoFrame>
      <SlugFieldInput
        defaultValue={defaultValue}
        args={args}
        naiveGenerateSlug={naiveGenerateSlug}
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
        value={value}
      />
    </FieldDemoFrame>
  );
};
