import { useField } from '@react-aria/label';

import { FieldPrimitive } from './FieldPrimitive';
import { FieldProps, FieldRenderProp } from './types';

type InternalFieldProps = { children: FieldRenderProp } & FieldProps;

/**
 * Provides the accessibility implementation for input fields. Fields accept
 * user input, gain context from their label, and may display a description or
 * error message.
 */
export const Field = (props: InternalFieldProps) => {
  const {
    children,
    description,
    errorMessage,
    isDisabled,
    isReadOnly,
    isRequired,
    label,
    ...otherProps
  } = props;
  let { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useField(props);

  const renderProps = {
    ...fieldProps,
    disabled: isDisabled,
    readOnly: isReadOnly,
    'aria-required': isRequired || undefined,
    'aria-invalid': errorMessage ? true : undefined,
  };

  return (
    <FieldPrimitive
      isRequired={isRequired}
      label={label}
      labelProps={labelProps}
      description={description}
      descriptionProps={descriptionProps}
      errorMessage={errorMessage}
      errorMessageProps={errorMessageProps}
      {...otherProps}
    >
      {children(renderProps)}
    </FieldPrimitive>
  );
};
