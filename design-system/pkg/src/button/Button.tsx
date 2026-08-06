import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components/Button';
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components/Link';
import { ForwardedRef, forwardRef, useEffect, useMemo, useState } from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { SlotProvider, useSlotProps } from '@keystar/ui/slots';
import { filterStyleProps } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import {
  ButtonElementProps,
  ButtonProps,
  CommonButtonProps,
  LinkElementProps,
} from './types';
import { buttonClassList, useButtonStyles } from './useButtonStyles';
import { ProgressCircle } from '../progress';

/**
 * Buttons are pressable elements that are used to trigger actions, their label
 * should express what action will occur when the user interacts with it.
 */
export const Button = forwardRef(function Button(
  props: ButtonProps,
  forwardedRef: ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  props = useProviderProps(props);
  props = useSlotProps(props, 'button');
  const children = useButtonChildren(props);

  if ('href' in props && props.href) {
    return (
      <LinkButton
        ref={forwardedRef as ForwardedRef<HTMLAnchorElement>}
        {...props}
      >
        {children}
      </LinkButton>
    );
  }

  return (
    <BaseButton
      ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
      {...props}
    >
      {children}
    </BaseButton>
  );
});

// Variants
// -----------------------------------------------------------------------------

/** @private Forked variant where an "href" is provided. */
const LinkButton = forwardRef(function Button(
  props: LinkElementProps,
  forwardedRef: ForwardedRef<HTMLAnchorElement>
) {
  const { children } = props;
  const styleProps = useButtonStyles(props);

  return (
    <AriaLink
      {...(filterStyleProps(props, [
        'prominence',
        'tone',
        'static',
      ]) as AriaLinkProps)}
      {...styleProps}
      ref={forwardedRef}
    >
      {children}
    </AriaLink>
  );
});

/** @private Forked variant where an "href" is NOT provided. */
const BaseButton = forwardRef(function Button(
  props: ButtonElementProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const { children, isPending } = props;

  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const styleProps = useButtonStyles(props);

  // wait a second before showing the progress indicator. for actions that
  // resolve quickly, this prevents a flash of the pending treatment.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isPending) {
      timeout = setTimeout(() => {
        setIsProgressVisible(true);
      }, 1000);
    } else {
      setIsProgressVisible(false);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isPending]);

  return (
    <AriaButton
      {...(filterStyleProps(props, [
        'prominence',
        'tone',
        'static',
      ]) as AriaButtonProps)}
      {...styleProps}
      ref={forwardedRef}
      data-progress-visible={isProgressVisible || undefined}
    >
      {children}
      {isProgressVisible && (
        <ProgressCircle
          aria-hidden
          isIndeterminate
          size="small"
          UNSAFE_style={{ position: 'absolute' }}
        />
      )}
    </AriaButton>
  );
});

export const useButtonChildren = (props: CommonButtonProps) => {
  const { children } = props;

  // avoid unnecessary re-renders
  const slots = useMemo(() => {
    return {
      icon: {
        UNSAFE_className: buttonClassList.element('icon'),
      },
      text: {
        color: 'inherit',
        overflow: 'unset',
        trim: false,
        UNSAFE_className: buttonClassList.element('text'),
      },
    } as const;
  }, []);

  return (
    <SlotProvider slots={slots}>
      {isReactText(children) ? <Text>{children}</Text> : children}
    </SlotProvider>
  );
};
