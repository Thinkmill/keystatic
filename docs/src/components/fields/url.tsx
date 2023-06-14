'use client';

import { FrameComponent } from './frame';
import { UrlFieldInput } from '../../../../packages/keystatic/src/form/fields/url/ui';
import { useState } from 'react';

export const URLField = () => {
  const [value, setValue] = useState<string | null>('');

  return (
    <FrameComponent>
      <UrlFieldInput
        autoFocus={false}
        description={undefined}
        forceValidation={false}
        label="Label"
        onChange={setValue}
        validation={undefined}
        value={value}
      />
    </FrameComponent>
  );
};
