import { useMenu } from '@react-aria/menu';
import { mergeProps, useObjectRef, useSyncRef } from '@react-aria/utils';
import { useTreeState } from '@react-stately/tree';
import React, { RefObject, ReactElement, useContext } from 'react';

import { listStyles } from '@keystar/ui/listbox';
import { classNames, useStyleProps } from '@keystar/ui/style';

import { MenuContext } from './context';
import { MenuItem } from './MenuItem';
import { MenuSection } from './MenuSection';
import { MenuProps } from './types';

function Menu<T extends object>(
  props: MenuProps<T>,
  forwardedRef: RefObject<HTMLDivElement>
) {
  let contextProps = useContext(MenuContext);
  let completeProps = {
    ...mergeProps(contextProps, props),
  };

  let domRef = useObjectRef(forwardedRef);
  let state = useTreeState(completeProps);
  let { menuProps } = useMenu(completeProps, state, domRef);
  let styleProps = useStyleProps(completeProps);
  useSyncRef(contextProps, domRef);

  return (
    <div
      {...menuProps}
      {...styleProps}
      ref={domRef}
      className={classNames(listStyles, styleProps.className)}
      data-selection={state.selectionManager.selectionMode}
    >
      {[...state.collection].map(item => {
        if (item.type === 'section') {
          return <MenuSection key={item.key} item={item} state={state} />;
        }

        let menuItem = <MenuItem key={item.key} item={item} state={state} />;

        if (item.wrapper) {
          menuItem = item.wrapper(menuItem);
        }

        return menuItem;
      })}
    </div>
  );
}

/**
 * Menus display a list of actions or options that a user can choose.
 */
// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
const _Menu: <T>(
  props: MenuProps<T> & { ref?: RefObject<HTMLDivElement> }
) => ReactElement = React.forwardRef(Menu as any) as any;
export { _Menu as Menu };
