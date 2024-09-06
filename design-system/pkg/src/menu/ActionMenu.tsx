import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { filterDOMProps } from '@react-aria/utils';
import { ForwardedRef, forwardRef, ReactElement, Ref } from 'react';

import localizedMessages from './l10n';
import { Menu } from './Menu';
import { MenuTrigger } from './MenuTrigger';
import { ActionMenuProps } from './types';

import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { moreHorizontalIcon } from '@keystar/ui/icon/icons/moreHorizontalIcon';
import { useSlotProps } from '@keystar/ui/slots';

function ActionMenu<T extends object>(
  props: ActionMenuProps<T>,
  ref: ForwardedRef<HTMLButtonElement>
) {
  props = useSlotProps(props, 'actionMenu');
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let buttonProps = filterDOMProps(props, { labelable: true });
  if (buttonProps['aria-label'] === undefined) {
    buttonProps['aria-label'] = stringFormatter.format('moreActions');
  }

  return (
    <MenuTrigger
      isOpen={props.isOpen}
      defaultOpen={props.defaultOpen}
      onOpenChange={props.onOpenChange}
      align={props.align}
      direction={props.direction}
      shouldFlip={props.shouldFlip}
    >
      <ActionButton ref={ref} {...props} {...buttonProps}>
        <Icon src={moreHorizontalIcon} />
      </ActionButton>
      <Menu
        children={props.children}
        items={props.items}
        disabledKeys={props.disabledKeys}
        onAction={props.onAction}
      />
    </MenuTrigger>
  );
}

/**
 * ActionMenu combines an ActionButton with a Menu for simple "more actions" use cases.
 */
const _ActionMenu: <T>(
  props: ActionMenuProps<T> & { ref?: Ref<HTMLButtonElement> }
) => ReactElement = forwardRef(ActionMenu) as any;
export { _ActionMenu as ActionMenu };
