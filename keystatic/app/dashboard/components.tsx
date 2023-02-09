import { PropsWithChildren } from 'react';

import { Flex } from '@voussoir/layout';
import { Text } from '@voussoir/typography';

export const SummaryBlock = ({ children }: PropsWithChildren) => {
  return (
    <Flex direction="column" gap="large">
      {Array.isArray(children)
        ? children.map((paragraph, index) => (
            <Text elementType="p" key={index}>
              {paragraph}
            </Text>
          ))
        : children}
    </Flex>
  );
};
