import {
  DividerProps,
  IconProps,
  HeadingProps,
  TextProps,
} from '@keystar/ui/types';
import { ReactNode } from 'react';

export type HTMLTag = keyof JSX.IntrinsicElements & keyof HTMLElementTagNameMap;

export type SlotProps = {
  slot?: string;
};

// NOTE: safety mechanism to prevent complex values declared against slots:
// 1. Only primitive values can be memoized.
// 2. Simplifies the scope and responsibility of this module.
export type OmitNonPrimitive<P> = Pick<
  P,
  {
    [K in keyof P]: P[K] extends boolean | number | string | undefined
      ? K
      : never;
  }[keyof P]
>;

// FIXME: don't love "elementType" being appended to the type like this...
export type ToSlotProps<P> = Partial<P> & {
  elementType?: HTMLTag;
};

export type SlotContextType = {
  divider?: ToSlotProps<DividerProps>;
  icon?: ToSlotProps<IconProps>;
  heading?: ToSlotProps<HeadingProps>;
  text?: ToSlotProps<TextProps>;
  // support _generic_ slots e.g. two text slots like "summary" and "detail"
  [key: string]: any;
};

export type ProviderProps<P = unknown> = { children: ReactNode } & P;
export type SlotProviderProps = ProviderProps<{ slots: SlotContextType }>;
