'use client';

import { FieldDemoFrame } from './frame';
import { UrlFieldInput } from '../../../../packages/keystatic/src/form/fields/url/ui';
import { useState } from 'react';

export const URLFieldDemo = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <FieldDemoFrame>
      <UrlFieldInput
        label="URL"
        description="The website URL"
        value={value}
        onChange={setValue}
        autoFocus={false}
        validation={undefined}
        forceValidation={false}
      />
    </FieldDemoFrame>
  );
};
