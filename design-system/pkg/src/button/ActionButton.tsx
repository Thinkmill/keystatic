import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components/Button';
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components/Link';
import { ForwardedRef, forwardRef, useMemo } from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { SlotProvider, SlotContextType, useSlotProps } from '@keystar/ui/slots';
import { filterStyleProps } from '@keystar/ui/style';
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
  props = useProviderProps(props);
  props = useSlotProps(props, 'button');
  const children = useActionButtonChildren(props);

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
const LinkButton = forwardRef(function LinkActionButton(
  props: ActionLinkElementProps,
  forwardedRef: ForwardedRef<HTMLAnchorElement>
) {
  const { children } = props;
  const styleProps = useActionButtonStyles(props);

  return (
    <AriaLink
      {...(filterStyleProps(props, ['prominence', 'static']) as AriaLinkProps)}
      {...styleProps}
      ref={forwardedRef}
    >
      {children}
    </AriaLink>
  );
});

/** @private Forked variant where an "href" is NOT provided. */
const BaseButton = forwardRef(function BaseActionButton(
  props: ActionButtonElementProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const { children } = props;
  const styleProps = useActionButtonStyles(props);

  return (
    <AriaButton
      {...(filterStyleProps(props, [
        'isSelected',
        'prominence',
        'static',
      ]) as AriaButtonProps)}
      {...styleProps}
      ref={forwardedRef}
    >
      {children}
    </AriaButton>
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
