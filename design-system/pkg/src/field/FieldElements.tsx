import { FieldError } from 'react-aria-components/FieldError';
import { Label } from 'react-aria-components/Label';
import { Text as AriaText } from 'react-aria-components/Text';
import { ReactElement, ReactNode, useId, useMemo } from 'react';

import { css, tokenSchema } from '@keystar/ui/style';

import { FieldDescription } from './FieldDescription';
import { FieldLabel } from './FieldLabel';
import { FieldMessage } from './FieldMessage';
import { SlotProvider } from '../slots';

export const fieldRootClassName = css({
  display: 'flex',
  flexDirection: 'column',
  gap: tokenSchema.size.space.medium,
  minWidth: 0,
});

type FieldLabelElementProps = {
  contextualHelp?: ReactElement;
  isRequired?: boolean;
  label?: ReactNode;
  supplementRequiredState?: boolean;
};

export function FieldLabelElement({
  contextualHelp,
  isRequired,
  label,
  supplementRequiredState,
}: FieldLabelElementProps) {
  let labelId = useId();
  let contextualHelpId = useId();
  let slots = useMemo(
    () => ({
      button: {
        UNSAFE_className: css({
          marginBottom: tokenSchema.typography.text.regular.capheightTrim,
          marginTop: tokenSchema.typography.text.regular.baselineTrim,
        }),
        id: contextualHelpId,
        'aria-labelledby': `${labelId} ${contextualHelpId}`,
      },
    }),
    [contextualHelpId, labelId]
  );

  if (!label) return null;

  let labelElement = (
    <Label id={labelId}>
      <FieldLabel
        elementType="span"
        isRequired={isRequired}
        supplementRequiredState={supplementRequiredState}
      >
        {label}
      </FieldLabel>
    </Label>
  );

  if (!contextualHelp) return labelElement;

  return (
    <div
      className={css({
        alignItems: 'center',
        display: 'flex',
        gap: tokenSchema.size.space.small,
      })}
    >
      {labelElement}
      <SlotProvider slots={slots}>{contextualHelp}</SlotProvider>
    </div>
  );
}

export function FieldDescriptionElement({
  children,
}: {
  children?: ReactNode;
}) {
  if (!children) return null;
  return (
    <AriaText slot="description">
      <FieldDescription>{children}</FieldDescription>
    </AriaText>
  );
}

export function FieldErrorElement({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <FieldError>
      <FieldMessage>{children}</FieldMessage>
    </FieldError>
  );
}
