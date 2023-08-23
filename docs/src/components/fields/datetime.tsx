// datetime.tsx
'use client';

import { FieldDemoFrame } from './frame';
import { DatetimeFieldInput } from '../../../../packages/keystatic/src/form/fields/datetime/ui'; // Update the import to match your directory structure
import { useState } from 'react';

export const DatetimeFieldDemo = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <FieldDemoFrame>
      <DatetimeFieldInput
        autoFocus={false}
        description="The date and time of the event"
        forceValidation={false}
        label="Event date and time"
        onChange={setValue}
        value={value}
      />
    </FieldDemoFrame>
  );
};
