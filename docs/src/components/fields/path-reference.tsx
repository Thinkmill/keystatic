'use client';

import { FrameComponent } from './frame';
import { PathReferenceInput } from '../../../../packages/keystatic/src/form/fields/pathReference/ui';
import { useState } from 'react';

export const PathReferenceField = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <FrameComponent>
      <PathReferenceInput
        label="Label"
        value={value}
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
        description={undefined}
        validation={undefined}
        pattern={undefined}
      />
    </FrameComponent>
  );
};
