import { DOMProps } from '@react-types/shared';
import { PropsWithChildren } from 'react';

import { Text } from '@keystar/ui/typography';

type FieldDescriptionProps = PropsWithChildren<DOMProps>;

export const FieldDescription = (props: FieldDescriptionProps) => {
  return <Text size="small" color="neutralSecondary" {...props} />;
};
