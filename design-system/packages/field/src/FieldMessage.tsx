import { PropsWithChildren } from 'react';

import { alertTriangleIcon } from '@keystar-ui/icon/icons/alertTriangleIcon';
import { Icon } from '@keystar-ui/icon';
import { Flex } from '@keystar-ui/layout';
import { css, tokenSchema } from '@keystar-ui/style';
import { Text } from '@keystar-ui/typography';
import { DOMProps } from '@keystar-ui/types';

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
