import { useField } from 'react-aria/useField';
import { useId, useMemo } from 'react';

import { Flex } from '@keystar/ui/layout';
import { css, tokenSchema, useStyleProps } from '@keystar/ui/style';

import { FieldDescription } from './FieldDescription';
import { FieldLabel } from './FieldLabel';
import { FieldMessage } from './FieldMessage';
import { FieldProps, FieldRenderProp } from './types';
import { SlotProvider } from '../slots';

type InternalFieldProps = { children: FieldRenderProp } & FieldProps;

/**
 * Provides accessible labeling and messages for an arbitrary field control.
 * Components with a RAC field root compose their field elements directly.
 */
export function Field(props: InternalFieldProps) {
  let {
    children,
    contextualHelp,
    description,
    errorMessage,
    isDisabled,
    isReadOnly,
    isRequired,
    label,
    labelElementType,
  } = props;
  let { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useField(props);
  let styleProps = useStyleProps(props);
  let contextualHelpId = useId();
  let contextualHelpSlots = useMemo(
    () => ({
      button: {
        UNSAFE_className: css({
          marginBottom: tokenSchema.typography.text.regular.capheightTrim,
          marginTop: tokenSchema.typography.text.regular.baselineTrim,
        }),
        id: contextualHelpId,
        'aria-labelledby': labelProps.id
          ? `${labelProps.id} ${contextualHelpId}`
          : undefined,
      },
    }),
    [contextualHelpId, labelProps.id]
  );
  let inputProps = {
    ...fieldProps,
    disabled: isDisabled,
    readOnly: isReadOnly,
    'aria-required': isRequired || undefined,
    'aria-invalid': errorMessage ? true : undefined,
  };

  let labelElement = label ? (
    <FieldLabel
      {...labelProps}
      elementType={labelElementType}
      isRequired={isRequired}
    >
      {label}
    </FieldLabel>
  ) : null;

  return (
    <Flex
      direction="column"
      gap="medium"
      minWidth={0}
      UNSAFE_className={styleProps.className}
      UNSAFE_style={styleProps.style}
    >
      {labelElement && contextualHelp ? (
        <Flex gap="small" alignItems="center">
          {labelElement}
          <SlotProvider slots={contextualHelpSlots}>
            {contextualHelp}
          </SlotProvider>
        </Flex>
      ) : (
        labelElement
      )}
      {description && (
        <FieldDescription {...descriptionProps}>{description}</FieldDescription>
      )}
      {children(inputProps)}
      {errorMessage && (
        <FieldMessage {...errorMessageProps}>{errorMessage}</FieldMessage>
      )}
    </Flex>
  );
}
