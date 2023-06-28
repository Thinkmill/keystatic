import { PropsWithChildren } from 'react';
import { DOMProps } from '@react-types/shared';

import { alertTriangleIcon } from '@voussoir/icon/icons/alertTriangleIcon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { css, tokenSchema } from '@voussoir/style';
import { Text } from '@voussoir/typography';

type FieldMessageProps = PropsWithChildren<DOMProps>;

export const FieldMessage = (props: FieldMessageProps) => {
  return (
    <Flex
      gap="regular"
      UNSAFE_className={css({ marginTop: 'calc(var(--icon-offset) * -1)' })}
      UNSAFE_style={{
        // @ts-ignore
        '--icon-offset': `calc(${tokenSchema.size.icon.regular} - ${tokenSchema.fontsize.text.small.size})`,
      }}
    >
      <Icon src={alertTriangleIcon} color="critical" />
      <Text
        color="critical"
        size="small"
        UNSAFE_className={css({ paddingTop: 'var(--icon-offset)' })}
        {...props}
      />
    </Flex>
  );
};
