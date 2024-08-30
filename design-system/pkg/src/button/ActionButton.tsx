import { useButton } from '@react-aria/button';
import { useHover } from '@react-aria/interactions';
import { useLink } from '@react-aria/link';
import { filterDOMProps, mergeProps, useObjectRef } from '@react-aria/utils';
import { ForwardedRef, forwardRef, useMemo } from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { SlotProvider, SlotContextType, useSlotProps } from '@keystar/ui/slots';
import { FocusRing } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import {
  actionButtonClassList,
  useActionButtonStyles,
} from './useActionButtonStyles';
import {
  ActionButtonElementProps,
  ActionButtonProps,
  ActionLinkElementProps,
  CommonActionButtonProps,
} from './types';

/**
 * Action buttons allow users to perform an action. They’re used for similar,
 * task-based options within a workflow, and are ideal for interfaces where
 * buttons aren’t meant to draw a lot of attention.
 */
export const ActionButton = forwardRef(function ActionButton(
  props: ActionButtonProps,
  forwardedRef: ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  const domRef = useObjectRef(forwardedRef);
  const children = useActionButtonChildren(props);

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
const LinkButton = forwardRef(function LinkActionButton(
  props: ActionLinkElementProps,
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
  const styleProps = useActionButtonStyles(props, { isHovered, isPressed });

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
const BaseButton = forwardRef(function BaseActionButton(
  props: ActionButtonElementProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  props = useProviderProps(props);
  props = useSlotProps(props, 'button');

  const { children, isDisabled, ...otherProps } = props;
  const domRef = useObjectRef(forwardedRef);
  const { buttonProps, isPressed } = useButton(props, domRef);
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const styleProps = useActionButtonStyles(props, { isHovered, isPressed });

  return (
    <button
      ref={domRef}
      {...styleProps}
      {...filterDOMProps(otherProps, { propNames: new Set(['form']) })}
      {...mergeProps(buttonProps, hoverProps)}
    >
      {children}
    </button>
  );
});

// Utils
// -----------------------------------------------------------------------------

let iconClassName = actionButtonClassList.element('icon');
let textClassName = actionButtonClassList.element('text');

export const useActionButtonChildren = (
  props: CommonActionButtonProps,
  alternateSlots?: SlotContextType
) => {
  const { children } = props;

  // avoid unnecessary re-renders
  const slots = useMemo(() => {
    return {
      ...alternateSlots,
      icon: {
        UNSAFE_className: iconClassName,
        ...alternateSlots?.icon,
      },
      text: {
        color: 'inherit',
        overflow: 'unset',
        trim: false,
        UNSAFE_className: textClassName,
        ...alternateSlots?.text,
      },
    } as const;
  }, [alternateSlots]);

  return (
    <SlotProvider slots={slots}>
      {isReactText(children) ? <Text>{children}</Text> : children}
    </SlotProvider>
  );
};
