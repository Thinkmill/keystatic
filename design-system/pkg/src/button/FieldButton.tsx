import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components/Button';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
  useMemo,
} from 'react';

import { useSlotProps } from '@keystar/ui/slots';
import { classNames, css, filterStyleProps } from '@keystar/ui/style';

import { FieldButtonProps } from './types';
import { useActionButtonStyles } from './useActionButtonStyles';
import { useActionButtonChildren } from './ActionButton';

/** @private Internal component for composing complex field interactions. */
export const FieldButton: ForwardRefExoticComponent<
  FieldButtonProps & { ref?: Ref<HTMLButtonElement> }
> = forwardRef(function FieldButton(
  props: FieldButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  props = useSlotProps(props, 'button');
  let { isActive } = props;
  let { children, styleProps } = useFieldButton(props);

  return (
    <AriaButton
      {...(filterStyleProps(props, [
        'isActive',
        'isInvalid',
        'prominence',
        'static',
        'validationState',
      ]) as AriaButtonProps)}
      {...styleProps}
      ref={forwardedRef}
      data-active={isActive || undefined}
      className={classNames(
        css({
          justifyContent: 'space-between',
          textAlign: 'start',
        }),
        styleProps.className
      )}
      style={{ ...styleProps.style, boxShadow: 'none' }}
    >
      {children}
    </AriaButton>
  );
});

// Utils
// -----------------------------------------------------------------------------

export function useFieldButton(props: FieldButtonProps) {
  const styleProps = useActionButtonStyles(props);
  let slots = useMemo(() => ({ text: { flex: true } }), []);
  let children = useActionButtonChildren(props, slots);

  return { children, styleProps };
}
