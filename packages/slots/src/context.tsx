import { mergeProps } from '@react-aria/utils';
import React, { useContext, useMemo } from 'react';

import {
  SlotProps,
  SlotContextType,
  ProviderProps,
  SlotProviderProps,
} from './types';

let SlotContext = React.createContext<SlotContextType>({});

/**
 * Merge component props with ancestral slot props. With the exception of "id",
 * consumer props are overriden by slot props, while event handlers will be
 * chained so all are called.
 */
export function useSlotProps<P extends { id?: string }>(
  props: P,
  defaultSlot: string
): P {
  let slot = (props as SlotProps).slot || defaultSlot;
  let { [slot]: slotProps = {} } = useContext(SlotContext);

  return mergeProps(props, mergeProps(slotProps, { id: props.id }));
}

/**
 * Not really "slots" like web components, more like "prop portalling" or
 * something. Default and override the props of descendent components.
 *
 * @example
 * <SlotProvider slots={{ text: { size: 'small' } }}>
 *   {children}
 * </SlotProvider>
 */
export const SlotProvider = (props: SlotProviderProps) => {
  let { children, slots } = props;
  let parentSlots = useContext(SlotContext);

  // Merge props for each slot from parent context and props
  let value = useMemo(
    () =>
      Object.keys(parentSlots)
        .concat(Object.keys(slots))
        .reduce(
          (obj, key) => ({
            ...obj,
            [key]: mergeProps(parentSlots[key], slots[key]),
          }),
          {}
        ),
    [parentSlots, slots]
  );

  return <SlotContext.Provider value={value}>{children}</SlotContext.Provider>;
};

// MAYBE: "preserve" some props?
// e.g. <ClearSlots preserve={{ slotName: true }} />
export const ClearSlots = ({ children }: ProviderProps) => {
  return <SlotContext.Provider value={{}}>{children}</SlotContext.Provider>;
};
