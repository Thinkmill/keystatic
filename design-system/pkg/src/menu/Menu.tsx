import {
  Menu as AriaMenu,
  RootMenuTriggerStateContext,
  type MenuProps as AriaMenuProps,
} from 'react-aria-components/Menu';
import React, {
  type ForwardedRef,
  type KeyboardEvent,
  type ReactElement,
  useContext,
} from 'react';

import { listStyles } from '@keystar/ui/listbox';
import {
  type BaseStyleProps,
  classNames,
  filterStyleProps,
  useStyleProps,
} from '@keystar/ui/style';

export interface MenuProps<T>
  extends Omit<AriaMenuProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

function Menu<T extends object>(
  props: MenuProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useStyleProps(props);
  let triggerState = useContext(RootMenuTriggerStateContext);
  let onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab' && !event.defaultPrevented) {
      triggerState?.close();
    }
  };

  return (
    <AriaMenu
      {...(filterStyleProps(props) as AriaMenuProps<T>)}
      ref={forwardedRef}
      shouldCloseOnSelect={
        props.shouldCloseOnSelect ?? props.selectionMode !== 'multiple'
      }
      {...({ onKeyDown } as Record<string, unknown>)}
      className={classNames(listStyles, styleProps.className)}
      style={styleProps.style}
    />
  );
}

const _Menu = React.forwardRef(Menu) as <T extends object>(
  props: MenuProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _Menu as Menu };
