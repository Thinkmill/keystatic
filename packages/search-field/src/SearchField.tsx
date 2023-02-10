import { useSearchField } from '@react-aria/searchfield';
import { useObjectRef } from '@react-aria/utils';
import { useSearchFieldState } from '@react-stately/searchfield';
import { forwardRef } from 'react';

import { ClearButton } from '@voussoir/button';
import { searchIcon } from '@voussoir/icon/icons/searchIcon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { css } from '@voussoir/style';
import { TextFieldPrimitive } from '@voussoir/text-field';

import { SearchFieldProps } from './types';

/** Search fields are text fields, specifically designed for search behaviour. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField(props, forwardedRef) {
    const {
      autoFocus,
      description,
      errorMessage,
      id,
      isDisabled,
      isReadOnly,
      isRequired,
      label,
      showIcon = true,
      ...styleProps
    } = props;

    let domRef = useObjectRef(forwardedRef);
    let state = useSearchFieldState(props);
    let {
      labelProps,
      inputProps,
      clearButtonProps,
      descriptionProps,
      errorMessageProps,
    } = useSearchField(props, state, domRef);

    let clearButtonVisible = state.value !== '' && !props.isReadOnly;
    let clearButton = (
      <ClearButton {...clearButtonProps} preventFocus isDisabled={isDisabled} />
    );
    let startElement = (
      <Flex
        alignItems="center"
        flexShrink={0}
        justifyContent="center"
        pointerEvents="none"
        width="regular"
      >
        <Icon src={searchIcon} color="neutralSecondary" />
      </Flex>
    );

    return (
      <TextFieldPrimitive
        ref={domRef}
        {...styleProps}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        label={label}
        labelProps={labelProps}
        inputProps={inputProps}
        inputWrapperProps={{
          className: css({
            input: {
              '&[data-adornment="start"]': {
                paddingInlineStart: 0,
              },
              '&[data-adornment="both"]': {
                paddingInlineEnd: 0,
              },
            },
          }),
        }}
        description={description}
        descriptionProps={descriptionProps}
        errorMessage={errorMessage}
        errorMessageProps={errorMessageProps}
        startElement={showIcon && startElement}
        endElement={clearButtonVisible && clearButton}
      />
    );
  }
);
