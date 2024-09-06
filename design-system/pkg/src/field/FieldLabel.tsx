import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { AllHTMLAttributes } from 'react';

import { css, tokenSchema } from '@keystar/ui/style';
import { useTextStyles } from '@keystar/ui/typography';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

import localizedMessages from './l10n';

export type A11yLabelProps = {
  /**
   * For controls that DO NOT include a semantic element for user input. In
   * these cases the "required" state would not otherwise be announced to users
   * of assistive technology.
   */
  supplementRequiredState?: boolean;
};

type FieldLabelProps = {
  isRequired?: boolean;
} & A11yLabelProps &
  AllHTMLAttributes<HTMLElement>;

export const FieldLabel = forwardRefWithAs<FieldLabelProps, 'label'>(
  function FieldLabel(
    {
      children,
      elementType: ElementType = 'label',
      isRequired,
      supplementRequiredState,
      ...labelProps
    },
    forwardedRef
  ) {
    const styleProps = useTextStyles({
      color: 'neutral',
      size: 'regular',
      trim: true,
      weight: 'medium',
      UNSAFE_className: css({ cursor: 'default' }),
    });

    return (
      <ElementType ref={forwardedRef} {...labelProps} {...styleProps}>
        {children}
        {isRequired && (
          <Asterisk supplementRequiredState={supplementRequiredState} />
        )}
      </ElementType>
    );
  }
);

/**
 * Display a required indicator for monitor users.
 *
 * In cases that don't include a semantic element for user input, describe the
 * required state for users of assistive technology.
 */
// NOTE: ideally this would be handled with the `aria-required` attribute, but
// that's not appropriate on buttons:
// > The attribute "aria-required" is not supported by the role button.
//
// It could go on the listbox, but the current implementation doesn't render the
// listbox until the dialog is open...
function Asterisk({ supplementRequiredState }: A11yLabelProps) {
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  return (
    <span
      aria-label={
        supplementRequiredState
          ? stringFormatter.format('(required)')
          : undefined
      }
    >
      <span
        aria-hidden
        className={css({
          color: tokenSchema.color.foreground.critical,
          fontSize: tokenSchema.typography.text.large.size,
          lineHeight: 1,
          paddingInlineStart: '0.125em',
        })}
      >
        *
      </span>
    </span>
  );
}
