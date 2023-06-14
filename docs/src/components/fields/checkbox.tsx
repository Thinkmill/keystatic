'use client';

import { FrameComponent } from './frame';
import { useState } from 'react';
import { Checkbox } from '@voussoir/checkbox';
import { Text } from '@voussoir/typography';

export const CheckboxField = () => {
  const [value, setValue] = useState(false);

  return (
    <FrameComponent>
      <Checkbox isSelected={value} onChange={setValue} autoFocus={false}>
        <Text>Option</Text>
      </Checkbox>
    </FrameComponent>
  );
};
