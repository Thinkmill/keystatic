'use client';

import { FrameComponent } from './frame';
import { UrlFieldInput } from '../../../../packages/keystatic/src/form/fields/url/ui';
import { useState } from 'react';

export const URLField = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <FrameComponent>
      <UrlFieldInput
        label="URL"
        description="The website URL"
        value={value}
        onChange={setValue}
        autoFocus={false}
        validation={undefined}
        forceValidation={false}
      />
    </FrameComponent>
  );
};
