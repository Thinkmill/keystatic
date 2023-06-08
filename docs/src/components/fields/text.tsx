'use client';

import { TextFieldInput } from '../../../../packages/keystatic/src/form/fields/text/ui';
import { FrameComponent } from './frame';

export const Text = () => {
  return (
    <FrameComponent>
      <TextFieldInput
        multiline={false}
        label="Label"
        description={undefined}
        min={0}
        max={100}
        value=""
        onChange={value => console.log(value)}
        autoFocus={false}
        forceValidation={false}
      />
    </FrameComponent>
  );
};
