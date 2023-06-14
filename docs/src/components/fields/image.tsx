'use client';

import { FrameComponent } from './frame';
import { ImageFieldInput } from '../../../../packages/keystatic/src/form/fields/image/ui';
import { useState } from 'react';

export const ImageField = () => {
  const [value, setValue] = useState<{
    data: Uint8Array;
    extension: string;
    filename: string;
  } | null>(null);

  return (
    <FrameComponent>
      <ImageFieldInput
        label="Image"
        description={undefined}
        validation={undefined}
        value={value}
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
      />
    </FrameComponent>
  );
};
