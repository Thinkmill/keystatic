import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { ForwardedRef, forwardRef, ReactElement, Ref } from 'react';

import { messages } from '../intl';
import { Menu } from './Menu';
import { MenuTrigger } from './MenuTrigger';
import { ActionMenuProps } from './types';

import { ActionButton } from '@voussoir/button';
import { Icon } from '@voussoir/icon';
import { moreHorizontalIcon } from '@voussoir/icon/icons/moreHorizontalIcon';
import { useSlotProps } from '@voussoir/slots';
import { filterDOMProps } from '@voussoir/utils';

function ActionMenu<T extends object>(
  props: ActionMenuProps<T>,
  ref: ForwardedRef<HTMLButtonElement>
) {
  props = useSlotProps(props, 'actionMenu');
  let stringFormatter = useLocalizedStringFormatter(messages);
  let buttonProps = filterDOMProps(props, { labellable: true });
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
const _ActionMenu = forwardRef(ActionMenu) as <T>(
  props: ActionMenuProps<T> & { ref?: Ref<HTMLButtonElement> }
) => ReactElement;
export { _ActionMenu as ActionMenu };
