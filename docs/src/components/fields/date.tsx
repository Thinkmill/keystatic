'use client';

import { FieldDemoFrame } from './frame';
import { DateFieldInput } from '../../../../packages/keystatic/src/form/fields/date/ui';
import { useState } from 'react';

export const DateFieldDemo = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <FieldDemoFrame>
      <DateFieldInput
        autoFocus={false}
        description="The date of the event"
        forceValidation={false}
        label="Event date"
        onChange={setValue}
        value={value}
      />
    </FieldDemoFrame>
  );
};
