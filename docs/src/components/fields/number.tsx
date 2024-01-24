'use client';

import { FieldDemoFrame } from './frame';
import { NumberFieldInput } from '../../../../packages/keystatic/src/form/fields/number/ui';
import { useState } from 'react';

export const NumberFieldDemo = () => {
  const [value, setValue] = useState<number | null>(null);

  return (
    <FieldDemoFrame>
      <NumberFieldInput
        label="Cost"
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
        description="The cost of the item, in steps of 0.02"
        step={0.02}
        validation={{ min: 0, max: 150.5, step: true }}
        value={value}
      />
    </FieldDemoFrame>
  );
};
