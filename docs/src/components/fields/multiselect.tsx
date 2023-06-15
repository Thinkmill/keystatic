'use client';

import { FieldDemoFrame } from './frame';
import { MultiselectFieldInput } from '../../../../packages/keystatic/src/form/fields/multiselect/ui';
import { useState } from 'react';

export const MultiselectFieldDemo = () => {
  const [value, setValue] = useState<readonly string[]>([
    'surfing',
    'basketball',
    'music',
  ]);

  return (
    <FieldDemoFrame>
      <MultiselectFieldInput
        label="Label"
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
        description={undefined}
        options={[
          { label: 'Surfing', value: 'surfing' },
          { label: 'Basketball', value: 'basketball' },
          { label: 'Music', value: 'music' },
          { label: 'Chess', value: 'chess' },
        ]}
        value={value}
      />
    </FieldDemoFrame>
  );
};
