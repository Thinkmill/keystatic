import {
  Menu as AriaMenu,
  type MenuProps as AriaMenuProps,
} from 'react-aria-components/Menu';
import { mergeProps } from 'react-aria/mergeProps';
import { useObjectRef } from 'react-aria/useObjectRef';
import React, { type ForwardedRef, type ReactElement, useContext } from 'react';

import { listStyles } from '@keystar/ui/listbox';
import {
  type BaseStyleProps,
  classNames,
  useStyleProps,
} from '@keystar/ui/style';

import { MenuContext } from './context';

export interface MenuProps<T>
  extends Omit<AriaMenuProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

function Menu<T extends object>(
  props: MenuProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let contextProps = useContext(MenuContext);
  let completeProps = mergeProps(contextProps, props) as MenuProps<T>;
  let domRef = useObjectRef(forwardedRef ?? contextProps.ref);
  let styleProps = useStyleProps(completeProps);
  let { closeOnSelect, onClose } = contextProps;
  let {
    onAction,
    shouldCloseOnSelect: shouldCloseOnSelectProp,
    ...otherProps
  } = completeProps;
  let shouldCloseOnSelect =
    closeOnSelect ??
    shouldCloseOnSelectProp ??
    completeProps.selectionMode !== 'multiple';

  return (
    <AriaMenu
      {...otherProps}
      {...styleProps}
      ref={domRef}
      className={classNames(listStyles, styleProps.className)}
      shouldCloseOnSelect={shouldCloseOnSelect}
      onAction={(key, event) => {
        onAction?.(key, event);
        if (shouldCloseOnSelect) {
          onClose?.();
        }
      }}
    />
  );
}

const _Menu = React.forwardRef(Menu) as <T extends object>(
  props: MenuProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _Menu as Menu };
