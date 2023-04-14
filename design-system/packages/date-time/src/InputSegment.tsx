import { useDateSegment } from '@react-aria/datepicker';
import { DateFieldState, DateSegment } from '@react-stately/datepicker';
import { DatePickerBase, DateValue } from '@react-types/datepicker';
import React, { useRef } from 'react';

import { css, tokenSchema } from '@voussoir/style';
import { Text } from '@voussoir/typography';
import { toDataAttributes } from '@voussoir/utils';

interface InputSegmentProps extends DatePickerBase<DateValue> {
  segment: DateSegment;
  state: DateFieldState;
}

interface LiteralSegmentProps {
  segment: DateSegment;
}

export function InputSegment({
  segment,
  state,
  ...otherProps
}: InputSegmentProps) {
  switch (segment.type) {
    // A separator, e.g. punctuation
    case 'literal':
      return <LiteralSegment segment={segment} />;

    // Editable segment
    default:
      return (
        <EditableSegment segment={segment} state={state} {...otherProps} />
      );
  }
}

function LiteralSegment({ segment }: LiteralSegmentProps) {
  return (
    <Text
      elementType="span"
      aria-hidden="true"
      color="neutralTertiary"
      UNSAFE_className={css({
        userSelect: 'none',
        whiteSpace: 'pre',
      })}
      data-testid={segment.type === 'literal' ? undefined : segment.type}
    >
      {segment.text}
    </Text>
  );
}

function EditableSegment({ segment, state }: InputSegmentProps) {
  let ref = useRef<HTMLDivElement>(null);
  let { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      {...toDataAttributes({
        placeholder: segment.isPlaceholder,
        readonly: !segment.isEditable,
      })}
      ref={ref}
      className={css({
        borderRadius: tokenSchema.size.radius.small,
        color: tokenSchema.color.foreground.neutral,
        paddingInline: tokenSchema.size.space.xsmall,

        // text styles
        fontFamily: tokenSchema.typography.fontFamily.base,
        fontSize: tokenSchema.fontsize.text.regular.size,
        fontVariantNumeric: 'tabular-nums',
        fontWeight: tokenSchema.typography.fontWeight.regular,
        lineHeight: tokenSchema.typography.lineheight.small,
        whiteSpace: 'nowrap',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',

        '[dir=ltr] &': { textAlign: 'right' },
        '[dir=rtl] &': { textAlign: 'left' },

        '&[data-placeholder=true]': {
          color: tokenSchema.color.foreground.neutralTertiary,
        },

        '&:focus': {
          backgroundColor: tokenSchema.color.background.accentEmphasis,
          color: tokenSchema.color.foreground.onEmphasis,
          outline: 'none',
        },
      })}
      style={{
        ...segmentProps.style,
        minWidth:
          segment.maxValue != null
            ? String(segment.maxValue).length + 'ch'
            : undefined,
      }}
      data-testid={segment.type}
    >
      <span
        aria-hidden="true"
        data-hidden={!segment.isPlaceholder}
        className={css({
          display: 'block',
          // fontStyle: 'italic',
          height: '0',
          pointerEvents: 'none',
          textAlign: 'center',
          visibility: 'hidden',
          width: '100%',

          '&[data-hidden=false]': {
            height: 'auto',
            visibility: 'visible',
          },
        })}
      >
        {segment.placeholder}
      </span>
      {!segment.isPlaceholder && segment.text}
    </div>
  );
}
