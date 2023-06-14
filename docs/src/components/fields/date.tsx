'use client';

import { FrameComponent } from './frame';
import { DateFieldInput } from '../../../../packages/keystatic/src/form/fields/date/ui';
import { useState } from 'react';

export const DateField = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <FrameComponent>
      <DateFieldInput
        autoFocus={false}
        description={undefined}
        forceValidation={false}
        label="Label"
        onChange={setValue}
        value={value}
      />
    </FrameComponent>
  );
};
