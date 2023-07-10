import { Box, BoxProps, Flex, FlexProps } from '@keystar/ui/layout';
import { css } from '@keystar/ui/style';

// defaults resolve some flex panel layout issues
export const View = (props: BoxProps) => {
  return <Box height="100%" minHeight={0} minWidth={0} {...props} />;
};
export const ScrollView = (props: BoxProps & { isDisabled?: boolean }) => {
  let { isDisabled, ...otherProps } = props;
  return (
    <View
      data-scrollable={isDisabled ? undefined : true}
      UNSAFE_className={css({
        '&[data-scrollable]': {
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        },
      })}
      {...otherProps}
    />
  );
};

export const Form = (props: FlexProps) => {
  return (
    <Flex
      elementType="form"
      direction="column"
      gap="xxlarge"
      height="100%"
      minHeight={0}
      minWidth={0}
      {...props}
    />
  );
};
