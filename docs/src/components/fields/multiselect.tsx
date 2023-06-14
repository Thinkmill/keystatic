'use client';

import { FrameComponent } from './frame';
import { MultiselectFieldInput } from '../../../../packages/keystatic/src/form/fields/multiselect/ui';
import { useState } from 'react';

export const MultiselectField = () => {
  const [value, setValue] = useState<readonly string[]>(['option-1']);

  return (
    <FrameComponent>
      <MultiselectFieldInput
        label="Label"
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
        description={undefined}
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
