import { NotEditable, PreviewProps, ObjectField } from '@keystatic/core';
import { Flex } from '@keystar/ui/layout';

import type { schema } from './aside';

export function preview(props: PreviewProps<ObjectField<typeof schema>>) {
  return (
    <Flex gap="medium">
      <NotEditable>{props.fields.icon.value}</NotEditable>
      <div>{props.fields.content.element}</div>
    </Flex>
  );
}
