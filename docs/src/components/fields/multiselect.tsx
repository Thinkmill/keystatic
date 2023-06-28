'use client';

import { FieldDemoFrame } from './frame';
import { MultiselectFieldInput } from '../../../../packages/keystatic/src/form/fields/multiselect/ui';
import { useState } from 'react';

const options = [
  { label: 'Surfing', value: 'surfing' },
  { label: 'Basketball', value: 'basketball' },
  { label: 'Music', value: 'music' },
  { label: 'Chess', value: 'chess' },
] as const;

type Options = (typeof options)[number]['value'];

export const MultiselectFieldDemo = () => {
  const [value, setValue] = useState<readonly Options[]>([
    'surfing',
    'basketball',
    'music',
  ]);

  return (
    <FieldDemoFrame>
      <MultiselectFieldInput
        label="Interests"
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
        description={undefined}
        options={options}
        value={value}
      />
    </FieldDemoFrame>
  );
};
