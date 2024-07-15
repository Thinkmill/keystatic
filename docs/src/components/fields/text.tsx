'use client';

import { FieldDemoFrame } from './frame';
import { TextFieldInput } from '../../../../packages/keystatic/src/form/fields/text/ui';
import { useState } from 'react';

export const TextFieldDemo = () => {
  const [value, setValue] = useState('');

  return (
    <FieldDemoFrame>
      <TextFieldInput
        autoFocus={false}
        description={undefined}
        forceValidation={false}
        label="Quote"
        max={100}
        min={0}
        multiline
        onChange={setValue}
        value={value}
        pattern={undefined}
      />
    </FieldDemoFrame>
  );
};
