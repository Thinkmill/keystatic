'use client';

import { FieldDemoFrame } from './frame';
import { FileFieldInput } from '../../../../packages/keystatic/src/form/fields/file/ui';
import { useState } from 'react';

export const FileFieldDemo = () => {
  const [value, setValue] = useState<{
    data: Uint8Array;
    extension: string;
    filename: string;
  } | null>(null);

  return (
    <FieldDemoFrame>
      <FileFieldInput
        label="Resume"
        description="The resume for this user"
        validation={undefined}
        value={value}
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
      />
    </FieldDemoFrame>
  );
};
