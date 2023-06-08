'use client';
import { VoussoirProvider } from '@voussoir/core';
import { TextFieldInput } from '../../../../packages/keystatic/src/form/fields/text/ui';

export const Text = () => {
  return (
    <VoussoirProvider>
      <TextFieldInput
        multiline={false}
        label="Text field"
        description={undefined}
        min={0}
        max={100}
        value=""
        onChange={value => console.log(value)}
        autoFocus={false}
        forceValidation={false}
      />
    </VoussoirProvider>
  );
};
