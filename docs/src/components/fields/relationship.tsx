'use client';

import { FrameComponent } from './frame';
// import { RelationshipInput } from '../../../../packages/keystatic/src/form/fields/relationship/ui';
import { Key, useState } from 'react';
import { Combobox } from '@voussoir/combobox';
import { Item } from '@react-stately/collections';

export const RelationshipField = () => {
  const options = [
    { id: 1, name: 'collection-slug-1' },
    { id: 2, name: 'collection-slug-2' },
    { id: 3, name: 'collection-slug-3' },
    { id: 4, name: 'collection-slug-4' },
    { id: 5, name: 'collection-slug-5' },
    { id: 6, name: 'collection-slug-6' },
  ];

  const [, setValue] = useState<Key | string>();

  return (
    <FrameComponent>
      {/* <RelationshipInput
        label="Label"
        onChange={setValue}
        autoFocus={false}
        forceValidation={false}
        description={undefined}
        validation={undefined}
        collection="something"
        value={value}
      /> */}
      <Combobox
        label="Label"
        onSelectionChange={setValue}
        defaultItems={options}
        width="auto"
      >
        {item => <Item>{item.name}</Item>}
      </Combobox>
    </FrameComponent>
  );
};
