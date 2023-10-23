import { Flex } from '@keystar/ui/layout';
import { css, tokenSchema, useStyleProps } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import {
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
  useId,
  useMemo,
} from 'react';

import { FieldLabel } from './FieldLabel';
import { FieldMessage } from './FieldMessage';
import { FieldPrimitiveProps } from './types';
import { SlotProvider } from '../slots';

/**
 * Provides the accessibility implementation for input fields. Fields accept
 * user input, gain context from their label, and may display a description or
 * error message.
 */
export const FieldPrimitive: ForwardRefExoticComponent<
  FieldPrimitiveProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef<HTMLDivElement, FieldPrimitiveProps>(
  function FieldPrimitive(props, forwardedRef) {
    const {
      children,
      contextualHelp,
      isRequired,
      label,
      labelElementType,
      labelProps,
      description,
      descriptionProps,
      errorMessage,
      errorMessageProps,
      supplementRequiredState,
    } = props;
    const styleProps = useStyleProps(props);
    const contextualHelpId = useId();

    const contextualHelpSlots = useMemo(() => {
      return {
        // match capsize styles from the label text. stops the contextual help button
        // from pushing elements above/below it
        button: {
          UNSAFE_className: css({
            marginBottom: tokenSchema.typography.text.regular.capheightTrim,
            marginTop: tokenSchema.typography.text.regular.baselineTrim,
          }),
          id: contextualHelpId,
          'aria-labelledby': labelProps?.id
            ? `${labelProps.id} ${contextualHelpId}`
            : undefined,
        },
      };
    }, [contextualHelpId, labelProps?.id]);

    return (
      <Flex
        ref={forwardedRef}
        direction="column"
        gap="medium"
        minWidth={0}
        UNSAFE_className={styleProps.className}
        UNSAFE_style={styleProps.style}
      >
        {(() => {
          if (!label) {
            return null;
          }
          const labelUI = (
            <FieldLabel
              elementType={labelElementType}
              isRequired={isRequired}
              supplementRequiredState={supplementRequiredState}
              {...labelProps}
            >
              {label}
            </FieldLabel>
          );

          if (contextualHelp) {
            return (
              <Flex gap="small" alignItems="center">
                {labelUI}
                <SlotProvider slots={contextualHelpSlots}>
                  {contextualHelp}
                </SlotProvider>
              </Flex>
            );
          }

          return labelUI;
        })()}

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
  }
);
