'use client';

import { FieldDemoFrame } from './frame';
import { ImageFieldInput } from '../../../../packages/keystatic/src/form/fields/image/ui';
import { useState } from 'react';

export const ImageFieldDemo = () => {
  const [value, setValue] = useState<{
    data: Uint8Array;
    extension: string;
    filename: string;
  } | null>(null);

  return (
    <FieldDemoFrame>
      <ImageFieldInput
        label="Avatar"
        description="The avatar for this user"
        validation={undefined}
        value={value}
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
        transformFilename={undefined}
      />
    </FieldDemoFrame>
  );
};
