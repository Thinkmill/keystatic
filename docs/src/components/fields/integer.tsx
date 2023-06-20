'use client';

import { FieldDemoFrame } from './frame';
import { IntegerFieldInput } from '../../../../packages/keystatic/src/form/fields/integer/ui';
import { useState } from 'react';

export const IntegerFieldDemo = () => {
  const [value, setValue] = useState<number | null>(null);

  return (
    <FieldDemoFrame>
      <IntegerFieldInput
        label="Age"
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
        description="The person's age"
        validation={{ min: 0, max: 120 }}
        value={value}
      />
    </FieldDemoFrame>
  );
};
