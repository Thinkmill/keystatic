import { Flex } from '@voussoir/layout';
import { BaseStyleProps, useStyleProps } from '@voussoir/style';
import { Text } from '@voussoir/typography';
import {
  forwardRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import { FieldLabel } from './FieldLabel';
import { FieldMessage } from './FieldMessage';

type FieldPrimitiveProps = {
  children: ReactElement;
  isRequired?: boolean;
  label?: ReactNode;
  labelProps?: HTMLAttributes<HTMLElement>;
  description?: ReactNode;
  descriptionProps?: HTMLAttributes<HTMLElement>;
  errorMessage?: ReactNode;
  errorMessageProps?: HTMLAttributes<HTMLElement>;
  /**
   * For controls that DO NOT use a semantic element for user input. In these
   * cases the "required" state would not otherwise be announced to users of
   * assistive technology.
   */
  supplementRequiredState?: boolean;
} & BaseStyleProps;

/**
 * Provides the accessibility implementation for input fields. Fields accept
 * user input, gain context from their label, and may display a description or
 * error message.
 */
export const FieldPrimitive: ForwardRefExoticComponent<
  FieldPrimitiveProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef<HTMLDivElement, FieldPrimitiveProps>(function FieldPrimitive(
  props,
  forwardedRef
) {
  const {
    children,
    isRequired,
    label,
    labelProps,
    description,
    descriptionProps,
    errorMessage,
    errorMessageProps,
    supplementRequiredState,
  } = props;
  const styleProps = useStyleProps(props);

  return (
    <Flex
      ref={forwardedRef}
      direction="column"
      gap="medium"
      UNSAFE_className={styleProps.className}
      UNSAFE_style={styleProps.style}
    >
      {label && (
        <FieldLabel
          isRequired={isRequired}
          supplementRequiredState={supplementRequiredState}
          {...labelProps}
        >
          {label}
        </FieldLabel>
      )}

      {description && (
        <Text {...descriptionProps} size="small" color="neutralSecondary">
          {description}
        </Text>
      )}

      {children}

      {errorMessage && (
        <FieldMessage {...errorMessageProps}>{errorMessage}</FieldMessage>
      )}
    </Flex>
  );
});
