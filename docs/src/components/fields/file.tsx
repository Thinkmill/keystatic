'use client';

import { FrameComponent } from './frame';
import { FileFieldInput } from '../../../../packages/keystatic/src/form/fields/file/ui';
import { useState } from 'react';

export const FileField = () => {
  const [value, setValue] = useState<{
    data: Uint8Array;
    extension: string;
    filename: string;
  } | null>(null);

  return (
    <FrameComponent>
      <FileFieldInput
        label="Resume"
        description="The resume for this user"
        validation={undefined}
        value={value}
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
      />
    </FrameComponent>
  );
};
