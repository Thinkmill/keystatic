import { Button as AriaButton } from 'react-aria-components/Button';
import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectValue,
} from 'react-aria-components/Select';
import { type ForwardedRef, type ReactElement, forwardRef } from 'react';
import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';

import { FieldButton } from '@keystar/ui/button';
import type { FieldButtonProps } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { chevronsUpDownIcon } from '@keystar/ui/icon/icons/chevronsUpDownIcon';
import { ListBox } from '@keystar/ui/listbox';
import { Popover } from '@keystar/ui/overlays';
import { SlotProvider } from '@keystar/ui/slots';
import {
  classNames,
  css,
  filterStyleProps,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import type { PickerProps } from './types';
import localizedMessages from './l10n';
import {
  FieldDescriptionElement,
  FieldErrorElement,
  FieldLabelElement,
  fieldRootClassName,
} from '../field/FieldElements';

function Picker<T extends object>(
  props: PickerProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let {
    align = 'start',
    children,
    contextualHelp,
    dependencies,
    description,
    direction = 'bottom',
    items,
    label,
    menuWidth,
    errorMessage,
    isRequired,
    labelElementType: _labelElementType,
    placeholder = stringFormatter.format('placeholder'),
    prominence,
    shouldFlip = true,
    ...selectProps
  } = props;
  let styleProps = useStyleProps({ width: 'alias.singleLineWidth', ...props });

  return (
    <AriaSelect
      {...(filterStyleProps(selectProps) as AriaSelectProps<T>)}
      ref={forwardedRef}
      isInvalid={selectProps.isInvalid || Boolean(errorMessage)}
      isRequired={isRequired}
      className={classNames(fieldRootClassName, styleProps.className)}
      style={styleProps.style}
    >
      <FieldLabelElement
        contextualHelp={contextualHelp}
        isRequired={isRequired}
        label={label}
        supplementRequiredState
      />
      <FieldDescriptionElement>{description}</FieldDescriptionElement>
      <AriaButton
        render={({ className: _, ...buttonProps }) => (
          <FieldButton
            {...(buttonProps as FieldButtonProps)}
            autoFocus={props.autoFocus}
            isDisabled={props.isDisabled}
            prominence={prominence}
            UNSAFE_className={css({
              alignItems: 'center',
              contain: 'size',
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
              width: '100%',
            })}
          />
        )}
      >
        <SlotProvider
          slots={{
            icon: { marginEnd: 'small' },
            text: { color: 'inherit' },
            description: { isHidden: true },
          }}
        >
          <SelectValue>
            {({ isPlaceholder, selectedText }) => (
              <Text color={isPlaceholder ? 'neutralSecondary' : 'inherit'}>
                {selectedText || placeholder}
              </Text>
            )}
          </SelectValue>
        </SlotProvider>
        <Icon
          src={chevronsUpDownIcon}
          UNSAFE_className={css({
            marginInlineStart: tokenSchema.size.space.small,
          })}
        />
      </AriaButton>
      <Popover
        placement={`${direction} ${align}`}
        shouldFlip={shouldFlip}
        hideArrow
        UNSAFE_style={{ minWidth: 'var(--trigger-width)', width: menuWidth }}
      >
        <ListBox items={items} dependencies={dependencies}>
          {children}
        </ListBox>
      </Popover>
      <FieldErrorElement>{errorMessage}</FieldErrorElement>
    </AriaSelect>
  );
}

const _Picker = forwardRef(Picker) as <T extends object>(
  props: PickerProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _Picker as Picker };
