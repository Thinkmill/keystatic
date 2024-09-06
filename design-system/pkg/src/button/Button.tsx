import { useButton } from '@react-aria/button';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useHover } from '@react-aria/interactions';
import { useLink } from '@react-aria/link';
import { filterDOMProps, mergeProps, useObjectRef } from '@react-aria/utils';
import { ForwardedRef, forwardRef, useEffect, useMemo, useState } from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { SlotProvider, useSlotProps } from '@keystar/ui/slots';
import { FocusRing } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import localizedMessages from './l10n';
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
  const domRef = useObjectRef(forwardedRef);

  if ('href' in props && props.href) {
    return (
      <FocusRing autoFocus={props.autoFocus}>
        <LinkButton ref={domRef as ForwardedRef<HTMLAnchorElement>} {...props}>
          {children}
        </LinkButton>
      </FocusRing>
    );
  }

  return (
    <FocusRing autoFocus={props.autoFocus}>
      <BaseButton ref={domRef as ForwardedRef<HTMLButtonElement>} {...props}>
        {children}
      </BaseButton>
    </FocusRing>
  );
});

// Variants
// -----------------------------------------------------------------------------

/** @private Forked variant where an "href" is provided. */
const LinkButton = forwardRef(function Button(
  props: LinkElementProps,
  forwardedRef: ForwardedRef<HTMLAnchorElement>
) {
  const { children, isDisabled, ...otherProps } = props;

  const domRef = useObjectRef(forwardedRef);
  const { buttonProps, isPressed } = useButton(
    { elementType: 'a', ...props },
    domRef
  );
  const { linkProps } = useLink(props, domRef);
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const styleProps = useButtonStyles(props, { isHovered, isPressed });

  return (
    <a
      {...filterDOMProps(otherProps)}
      {...mergeProps(buttonProps, linkProps, hoverProps, styleProps)}
      ref={domRef}
    >
      {children}
    </a>
  );
});

/** @private Forked variant where an "href" is NOT provided. */
const BaseButton = forwardRef(function Button(
  props: ButtonElementProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  props = disablePendingProps(props);
  const { children, isDisabled, isPending, ...otherProps } = props;

  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const stringFormatter = useLocalizedStringFormatter(localizedMessages);
  const domRef = useObjectRef(forwardedRef);
  const { buttonProps, isPressed } = useButton(props, domRef);
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const styleProps = useButtonStyles(props, {
    isHovered,
    isPending: isProgressVisible,
    isPressed,
  });

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

  // prevent form submission when while pending
  const pendingProps = isPending
    ? {
        onClick: (e: MouseEvent) => e.preventDefault(),
      }
    : {
        onClick: () => {}, // satisfy TS expectations…
      };

  return (
    <button
      ref={domRef}
      {...styleProps}
      {...filterDOMProps(otherProps, { propNames: new Set(['form']) })}
      {...mergeProps(buttonProps, hoverProps, pendingProps)}
      aria-disabled={isPending ? 'true' : undefined}
    >
      {children}
      {isProgressVisible && (
        <ProgressCircle
          aria-atomic="false"
          aria-live="assertive"
          aria-label={stringFormatter.format('pending')}
          isIndeterminate
          size="small"
          UNSAFE_style={{ position: 'absolute' }}
        />
      )}
    </button>
  );
});

// Utils
// -----------------------------------------------------------------------------

function disablePendingProps(props: ButtonElementProps) {
  // disallow interaction while the button is pending
  if (props.isPending) {
    props = { ...props };
    props.onKeyDown = undefined;
    props.onKeyUp = undefined;
    props.onPress = undefined;
    props.onPressChange = undefined;
    props.onPressEnd = undefined;
    props.onPressStart = undefined;
    props.onPressUp = undefined;
  }

  return props;
}

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
