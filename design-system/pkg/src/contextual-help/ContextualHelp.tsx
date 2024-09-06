import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { mergeProps, useLabels } from '@react-aria/utils';
import {
  ForwardRefExoticComponent,
  ForwardedRef,
  Ref,
  forwardRef,
} from 'react';

import { ActionButton } from '@keystar/ui/button';
import { Dialog, DialogTrigger } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { helpCircleIcon } from '@keystar/ui/icon/icons/helpCircleIcon';
import { infoIcon } from '@keystar/ui/icon/icons/infoIcon';
import { ClearSlots } from '@keystar/ui/slots';
import { classNames, css, tokenSchema } from '@keystar/ui/style';

import localizedMessages from './l10n';
import { ContextualHelpProps } from './types';

/** Contextual help shows a user extra information about an adjacent component. */
export const ContextualHelp: ForwardRefExoticComponent<
  ContextualHelpProps & { ref?: Ref<HTMLButtonElement> }
> = forwardRef(function ContextualHelp(
  props: ContextualHelpProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  let { children, variant = 'help', ...otherProps } = props;

  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let labelProps = useLabels(otherProps, stringFormatter.format(variant));

  let icon = variant === 'info' ? infoIcon : helpCircleIcon;

  return (
    <DialogTrigger {...otherProps} type="popover">
      <ActionButton
        {...mergeProps(otherProps, labelProps, { isDisabled: false })}
        ref={ref}
        UNSAFE_className={classNames(
          css({
            borderRadius: tokenSchema.size.radius.small,
            height: tokenSchema.size.element.small,
            minWidth: 'unset',
            paddingInline: 0,
            width: tokenSchema.size.element.small,
          }),
          otherProps.UNSAFE_className
        )}
        prominence="low"
      >
        <Icon src={icon} />
      </ActionButton>
      <ClearSlots>
        <Dialog>{children}</Dialog>
      </ClearSlots>
    </DialogTrigger>
  );
});
