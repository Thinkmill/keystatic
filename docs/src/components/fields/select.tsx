'use client';

import { FieldDemoFrame } from './frame';
import { SelectFieldInput } from '../../../../packages/keystatic/src/form/fields/select/ui';
import { useState } from 'react';

const options = [
  { label: 'Designer', value: 'designer' },
  { label: 'Developer', value: 'developer' },
  { label: 'Product manager', value: 'product-manager' },
] as const;

type Option = (typeof options)[number]['value'];

export const SelectFieldDemo = () => {
  const [value, setValue] = useState<Option>('designer');

  return (
    <FieldDemoFrame>
      <SelectFieldInput
        label="Role"
        description="The person's role at the company"
        onChange={setValue}
        options={options}
        value={value}
      />
    </FieldDemoFrame>
  );
};
