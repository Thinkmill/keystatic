import { filterDOMProps, isMac as getIsMac } from '@react-aria/utils';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactNode,
  Ref,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { DOMProps } from '@react-types/shared';

import { useSlotProps } from '@keystar/ui/slots';
import { BaseStyleProps, css } from '@keystar/ui/style';

import { useTextStyles } from './text';

function noopSubscribe() {
  return () => {};
}

function useIsMac() {
  return useSyncExternalStore(noopSubscribe, getIsMac, () => false);
}

export type KbdProps = {
  /** Keyboard shortcut text. */
  children: ReactNode;
  /**
   * Prefix with OS-specific "alt" key.
   * @MacOS `⎇`
   * @Windows `Alt`
   */
  alt?: boolean;
  /**
   * Prefix with OS-specific "meta" key.
   * @MacOS `⌘`
   * @Windows `Ctrl`
   */
  meta?: boolean;
  /**
   * Prefix with OS-specific "shift" key.
   * @MacOS `⇧`
   * @Windows `Shift`
   */
  shift?: boolean;
  /**
   * A slot to place the shortcut text.
   * @default 'kbd'
   */
  slot?: string;
} & DOMProps &
  BaseStyleProps;

/** Represents text that specifies a keyboard command. */
export const Kbd: ForwardRefExoticComponent<
  KbdProps & { ref?: Ref<HTMLElement> }
> = forwardRef(function Kbd(
  props: KbdProps,
  forwardedRef: ForwardedRef<HTMLElement>
) {
  props = useSlotProps(props, 'kbd');
  let { alt, meta, shift, children, ...otherProps } = props;
  const styleProps = useTextStyles({
    casing: 'full-width',
    color: 'neutral',
    size: 'regular',
    weight: 'regular',
    ...otherProps,
  });

  const isMac = useIsMac();

  const modifiers = useMemo(() => {
    const SYSTEM_KEYS = isMac
      ? {
          alt: '⌥',
          meta: '⌘',
          shift: '⇧',
        }
      : {
          alt: 'Alt',
          meta: 'Ctrl',
          shift: 'Shift',
          // shift: '⇧', // maybe?
        };
    let keys = [
      alt && SYSTEM_KEYS.alt,
      shift && SYSTEM_KEYS.shift,
      meta && SYSTEM_KEYS.meta,
    ].filter(Boolean) as string[];

    return joinModifierKeys(keys, isMac);
  }, [alt, meta, shift, isMac]);

  return (
    <kbd
      {...filterDOMProps(otherProps)}
      {...styleProps}
      dir="ltr"
      ref={forwardedRef}
    >
      {modifiers}
      <Char>{children}</Char>
    </kbd>
  );
});

/**
 * NOTE: The 'full-width' text-transform has limited support.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#browser_compatibility
 * This hack ensures that single character shortcuts are visually aligned when
 * stacked, like when end-aligned in menu items, without needing to use a
 * monospace font.
 */
function Char(props: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={css({
        display: 'inline-block',
        minWidth: '1em',
        textAlign: 'center',
      })}
      {...props}
    />
  );
}

function joinModifierKeys(modifiers: string[], isMac: boolean) {
  if (modifiers.length === 0) {
    return '';
  }

  let delimiter = isMac ? '' : '+';
  return modifiers.join(delimiter) + delimiter;
}
