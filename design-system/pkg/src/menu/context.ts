import { FocusStrategy } from '@react-types/shared';
import React, { HTMLAttributes, MutableRefObject, useContext } from 'react';

export type MenuContextValue = {
  autoFocus?: boolean | FocusStrategy;
  closeOnSelect?: boolean;
  onClose?: () => void;
  ref?: MutableRefObject<HTMLDivElement | null>;
  shouldFocusWrap?: boolean;
} & HTMLAttributes<HTMLElement>;

export const MenuContext = React.createContext<MenuContextValue>({});

export function useMenuContext(): MenuContextValue {
  return useContext(MenuContext);
}
