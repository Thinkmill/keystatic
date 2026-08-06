import { Button as AriaButton } from 'react-aria-components/Button';
import {
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
} from 'react-aria-components/ComboBox';
import { Input } from 'react-aria-components/Input';
import { Popover } from 'react-aria-components/Popover';
import type { ForwardedRef } from 'react';

import { FieldButton } from '@keystar/ui/button';
import type { FieldButtonProps } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { chevronsUpDownIcon } from '@keystar/ui/icon/icons/chevronsUpDownIcon';
import { ListBox } from '@keystar/ui/listbox';
import {
  classNames,
  css,
  filterStyleProps,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';

import type { ComboboxMultiProps, ComboboxProps } from './types';
import {
  FieldDescriptionElement,
  FieldErrorElement,
  FieldLabelElement,
  fieldRootClassName,
} from '../field/FieldElements';

export function ComboboxBase<T extends object, M extends 'single' | 'multiple'>(
  props: M extends 'multiple' ? ComboboxMultiProps<T> : ComboboxProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>,
  selectionMode: M
) {
  let {
    align = 'start',
    children,
    contextualHelp,
    dependencies,
    description,
    direction = 'bottom',
    label,
    menuWidth,
    errorMessage,
    isRequired,
    labelElementType: _labelElementType,
    shouldFlip = true,
    ...comboBoxProps
  } = props;
  let styleProps = useStyleProps({ width: 'alias.singleLineWidth', ...props });

  return (
    <AriaComboBox
      {...(filterStyleProps(comboBoxProps) as AriaComboBoxProps<T, M>)}
      ref={forwardedRef}
      selectionMode={selectionMode}
      isInvalid={comboBoxProps.isInvalid || Boolean(errorMessage)}
      isRequired={isRequired}
      className={classNames(fieldRootClassName, styleProps.className)}
      style={styleProps.style}
    >
      <FieldLabelElement
        contextualHelp={contextualHelp}
        isRequired={isRequired}
        label={label}
      />
      <FieldDescriptionElement>{description}</FieldDescriptionElement>
      <div
        className={css({
          alignItems: 'center',
          display: 'flex',
          position: 'relative',
          width: '100%',
        })}
      >
        <Input
          name={comboBoxProps.name}
          placeholder={props.placeholder}
          className={css({
            backgroundColor: tokenSchema.color.background.canvas,
            border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
            borderRadius: tokenSchema.size.radius.regular,
            boxSizing: 'border-box',
            color: tokenSchema.color.alias.foregroundIdle,
            font: 'inherit',
            height: tokenSchema.size.element.regular,
            outline: 0,
            paddingInline: tokenSchema.size.space.medium,
            paddingInlineEnd: tokenSchema.size.element.regular,
            width: '100%',
            '&[data-focused]': {
              borderColor: tokenSchema.color.alias.borderFocused,
              boxShadow: `0 0 0 1px ${tokenSchema.color.alias.borderFocused}`,
            },
            '&[data-disabled]': {
              backgroundColor: tokenSchema.color.background.surfaceSecondary,
              color: tokenSchema.color.alias.foregroundDisabled,
            },
          })}
        />
        <AriaButton
          render={({ className: _, ...buttonProps }) => (
            <FieldButton
              {...(buttonProps as FieldButtonProps)}
              prominence="low"
              UNSAFE_className={css({
                insetInlineEnd: 0,
                position: 'absolute',
              })}
            />
          )}
        >
          <Icon src={chevronsUpDownIcon} />
        </AriaButton>
      </div>
      <Popover
        placement={`${direction} ${align}`}
        shouldFlip={shouldFlip}
        style={{ minWidth: 'var(--trigger-width)', width: menuWidth }}
      >
        <ListBox dependencies={dependencies}>{children}</ListBox>
      </Popover>
      <FieldErrorElement>{errorMessage}</FieldErrorElement>
    </AriaComboBox>
  );
}
