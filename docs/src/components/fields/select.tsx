'use client';

import { FrameComponent } from './frame';
import { SelectFieldInput } from '../../../../packages/keystatic/src/form/fields/select/ui';
import { useState } from 'react';

export const SelectField = () => {
  const [value, setValue] = useState('option-1');

  return (
    <FrameComponent>
      <SelectFieldInput
        label="Label"
        onChange={setValue}
        options={[
          { label: 'Option 1', value: 'option-1' },
          { label: 'Option 2', value: 'option-2' },
          { label: 'Option 3', value: 'option-3' },
        ]}
        value={value}
      />
    </FrameComponent>
  );
};
