'use client';
import { Box, BoxProps } from '@keystar/ui/layout';
import { css } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import type { JSX } from 'react';

export function MdxTable({ children, ...rest }: BoxProps): JSX.Element {
  return (
    <Box overflow="auto">
      <Box
        elementType="table"
        width="100%"
        UNSAFE_className={css({
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
        })}
        {...rest}
      >
        <colgroup>
          <col width="20%" />
          {/* <col width="80%" /> */}
        </colgroup>
        {children}
      </Box>
    </Box>
  );
}

export function MdxThead(props: BoxProps): JSX.Element {
  return <Box elementType="thead" {...props} />;
}

export function MdxTr(props: BoxProps): JSX.Element {
  return <Box elementType="tr" {...props} />;
}

export function MdxTh({ children, ...props }: BoxProps): JSX.Element {
  return (
    <Box
      elementType="th"
      paddingY="large"
      UNSAFE_className={css({ textAlign: 'start' })}
      {...props}
    >
      <Text
        casing="uppercase"
        color="neutralSecondary"
        size="small"
        weight="semibold"
      >
        {children}
      </Text>
    </Box>
  );
}

export function MdxTd({ children, ...props }: BoxProps): JSX.Element {
  return (
    <Box
      elementType="td"
      paddingY="large"
      borderTop="muted"
      // UNSAFE_className={css({ verticalAlign: 'baseline' })}
      {...props}
    >
      <Text>{children}</Text>
    </Box>
  );
}
