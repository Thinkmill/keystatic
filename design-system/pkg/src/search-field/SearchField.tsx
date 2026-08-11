import {
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
} from 'react-aria-components/SearchField';
import { forwardRef, useImperativeHandle, useRef } from 'react';

import { ClearButton } from '@keystar/ui/button';
import { searchIcon } from '@keystar/ui/icon/icons/searchIcon';
import { Icon } from '@keystar/ui/icon';
import { Flex } from '@keystar/ui/layout';
import {
  classNames,
  css,
  filterStyleProps,
  useStyleProps,
} from '@keystar/ui/style';
import { validateTextFieldProps } from '@keystar/ui/text-field';

import { SearchFieldProps } from './types';
import { TextFieldContent } from '../text-field/TextFieldBase';
import { fieldRootClassName } from '../field/FieldElements';

/** Search fields are text fields, specifically designed for search behaviour. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField(props, forwardedRef) {
    props = validateTextFieldProps(props);
    const {
      contextualHelp,
      description,
      errorMessage,
      isDisabled,
      isRequired,
      label,
      labelElementType: _labelElementType,
      showIcon = true,
      ...otherProps
    } = props;
    let inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(forwardedRef, () => inputRef.current!);
    let styleProps = useStyleProps(props);
    let startElement = (
      <Flex
        alignItems="center"
        flexShrink={0}
        justifyContent="center"
        pointerEvents="none"
        width="element.regular"
      >
        <Icon
          src={searchIcon}
          color={
            props.isDisabled
              ? 'color.alias.foregroundDisabled'
              : 'neutralSecondary'
          }
        />
      </Flex>
    );

    return (
      <AriaSearchField
        {...(filterStyleProps(otherProps) as AriaSearchFieldProps)}
        isInvalid={Boolean(errorMessage)}
        isRequired={isRequired}
        className={classNames(fieldRootClassName, styleProps.className)}
        style={styleProps.style}
      >
        {({ isEmpty }) => (
          <TextFieldContent
            contextualHelp={contextualHelp}
            description={description}
            endElement={
              !isEmpty &&
              !props.isReadOnly && (
                <ClearButton preventFocus isDisabled={isDisabled} />
              )
            }
            errorMessage={errorMessage}
            inputRef={inputRef}
            inputWrapperClassName={css({
              input: {
                '&[data-adornment="start"]': {
                  paddingInlineStart: 0,
                },
                '&[data-adornment="end"]': {
                  paddingInlineEnd: 0,
                },
                '&[data-adornment="both"]': {
                  paddingInline: 0,
                },
              },
            })}
            isRequired={isRequired}
            label={label}
            startElement={showIcon ? startElement : undefined}
          />
        )}
      </AriaSearchField>
    );
  }
);
