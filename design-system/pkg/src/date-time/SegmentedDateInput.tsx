import {
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
} from 'react-aria-components/DateField';

import { classNames, css, tokenSchema } from '@keystar/ui/style';

export function SegmentedDateInput({ className }: { className?: string }) {
  return (
    <AriaDateInput
      className={classNames(
        css({
          alignItems: 'center',
          backgroundColor: tokenSchema.color.background.canvas,
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
          borderRadius: tokenSchema.size.radius.regular,
          cursor: 'text',
          display: 'inline-flex',
          height: tokenSchema.size.element.regular,
          lineHeight: tokenSchema.typography.lineheight.small,
          minWidth: tokenSchema.size.scale[2000],
          outline: 0,
          overflowX: 'auto',
          paddingBlock: tokenSchema.size.space.small,
          paddingInline: tokenSchema.size.space.medium,
          scrollbarWidth: 'none',
          width: '100%',

          '&[data-hovered]': {
            borderColor: tokenSchema.color.alias.borderHovered,
          },
          '&[data-invalid]': {
            borderColor: tokenSchema.color.alias.borderInvalid,
          },
          '&[data-focus-within]': {
            borderColor: tokenSchema.color.alias.borderFocused,
            boxShadow: `0 0 0 1px ${tokenSchema.color.alias.borderFocused}`,
          },
          '&[data-disabled]': {
            backgroundColor: tokenSchema.color.alias.backgroundDisabled,
            borderColor: 'transparent',
          },
        }),
        className
      )}
    >
      {segment => (
        <AriaDateSegment
          segment={segment}
          data-testid={segment.type === 'literal' ? undefined : segment.type}
          className={css({
            borderRadius: tokenSchema.size.radius.small,
            color: tokenSchema.color.foreground.neutral,
            fontFamily: tokenSchema.typography.fontFamily.base,
            fontSize: tokenSchema.typography.text.regular.size,
            fontVariantNumeric: 'tabular-nums',
            fontWeight: tokenSchema.typography.fontWeight.regular,
            lineHeight: tokenSchema.typography.lineheight.small,
            paddingInline: tokenSchema.size.space.xsmall,
            whiteSpace: 'nowrap',
            MozOsxFontSmoothing: 'auto',
            WebkitFontSmoothing: 'auto',

            '&[data-placeholder]': {
              color: tokenSchema.color.foreground.neutralTertiary,
            },
            '&[data-focused]': {
              backgroundColor: tokenSchema.color.background.accentEmphasis,
              color: tokenSchema.color.foreground.onEmphasis,
              outline: 'none',
            },
            '&[data-type="literal"]': {
              paddingInline: 0,
              userSelect: 'none',
            },
          })}
        />
      )}
    </AriaDateInput>
  );
}
