'use client';

import { FrameComponent } from './frame';
import { SelectFieldInput } from '../../../../packages/keystatic/src/form/fields/select/ui';
import { useState } from 'react';

export const SelectField = () => {
  const [value, setValue] = useState('designer');

  return (
    <FrameComponent>
      <SelectFieldInput
        label="Role"
        description="The person's role at the company"
        onChange={setValue}
        options={[
          { label: 'Designer', value: 'designer' },
          { label: 'Developer', value: 'developer' },
          { label: 'Product manager', value: 'product-manager' },
        ]}
        value={value}
      />
    </FrameComponent>
  );
};
