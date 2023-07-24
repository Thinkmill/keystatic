import { ReactElement, ReactNode } from 'react';

import { Icon } from '@keystar/ui/icon';
import { Flex } from '@keystar/ui/layout';
import { Heading, Text } from '@keystar/ui/typography';

type EmptyStateProps =
  | { children: ReactNode }
  | {
      title?: ReactNode;
      icon?: ReactElement;
      message?: ReactNode;
      actions?: ReactNode;
    };

export function EmptyState(props: EmptyStateProps) {
  return (
    <Flex
      alignItems="center"
      direction="column"
      gap="large"
      justifyContent="center"
      minHeight="scale.3000"
      paddingX={{ mobile: 'medium', tablet: 'xlarge', desktop: 'xxlarge' }}
    >
      {'children' in props ? (
        props.children
      ) : (
        <>
          {props.icon && (
            <Icon src={props.icon} size="large" color="neutralEmphasis" />
          )}
          {props.title && (
            <Heading align="center" size="medium">
              {props.title}
            </Heading>
          )}
          {props.message && <Text align="center">{props.message}</Text>}
          {props.actions}
        </>
      )}
    </Flex>
  );
}
