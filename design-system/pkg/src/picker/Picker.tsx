import { Button as AriaButton } from 'react-aria-components/Button';
import { Popover as AriaPopover } from 'react-aria-components/Popover';
import {
  Select as AriaSelect,
  SelectValue,
} from 'react-aria-components/Select';
import { type ForwardedRef, type ReactElement, forwardRef } from 'react';
import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';

import { FieldButton } from '@keystar/ui/button';
import type { FieldButtonProps } from '@keystar/ui/button';
import { FieldPrimitive } from '@keystar/ui/field';
import { Icon } from '@keystar/ui/icon';
import { chevronsUpDownIcon } from '@keystar/ui/icon/icons/chevronsUpDownIcon';
import { ListBox } from '@keystar/ui/listbox';
import { SlotProvider } from '@keystar/ui/slots';
import { css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import type { PickerProps } from './types';
import localizedMessages from './l10n';

function Picker<T extends object>(
  props: PickerProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let {
    align = 'start',
    children,
    dependencies,
    direction = 'bottom',
    items,
    label,
    menuWidth,
    placeholder = stringFormatter.format('placeholder'),
    prominence,
    shouldFlip = true,
    ...selectProps
  } = props;

  return (
    <AriaSelect
      {...selectProps}
      aria-label={
        selectProps['aria-label'] ??
        (typeof label === 'string' ? label : undefined)
      }
      ref={forwardedRef}
    >
      <FieldPrimitive width="alias.singleLineWidth" {...props}>
        <>
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
          <AriaPopover
            placement={`${direction} ${align}`}
            shouldFlip={shouldFlip}
            style={{ minWidth: 'var(--trigger-width)', width: menuWidth }}
          >
            <ListBox items={items} dependencies={dependencies}>
              {children}
            </ListBox>
          </AriaPopover>
        </>
      </FieldPrimitive>
    </AriaSelect>
  );
}

const _Picker = forwardRef(Picker) as <T extends object>(
  props: PickerProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _Picker as Picker };
