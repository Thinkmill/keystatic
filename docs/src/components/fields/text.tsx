'use client';

import { FrameComponent } from './frame';
import { TextFieldInput } from '../../../../packages/keystatic/src/form/fields/text/ui';
import { useState } from 'react';

export const TextField = () => {
  const [value, setValue] = useState('');

  return (
    <FrameComponent>
      <TextFieldInput
        autoFocus={false}
        description={undefined}
        forceValidation={false}
        label="Label"
        max={100}
        min={0}
        multiline={false}
        onChange={setValue}
        value={value}
      />
    </FrameComponent>
  );
};
