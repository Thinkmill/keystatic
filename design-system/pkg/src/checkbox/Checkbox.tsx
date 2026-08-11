import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components/Checkbox';
import { HTMLAttributes, useMemo } from 'react';

import { Icon } from '@keystar/ui/icon';
import { checkIcon } from '@keystar/ui/icon/icons/checkIcon';
import { minusIcon } from '@keystar/ui/icon/icons/minusIcon';
import { SlotProvider } from '@keystar/ui/slots';
import {
  ClassList,
  classNames,
  css,
  filterStyleProps,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { CheckboxProps } from './types';

const checkboxClassList = new ClassList('Checkbox', ['indicator']);

export function Checkbox(props: CheckboxProps) {
  let { children, prominence, ...otherProps } = props;

  let styleProps = useStyleProps(otherProps);

  const labelClassName = css({
    alignItems: 'flex-start',
    display: 'inline-flex',
    gap: tokenSchema.size.space.regular,
    paddingInlineEnd: tokenSchema.size.space.large,
    paddingBlock: tokenSchema.size.space.regular,
    position: 'relative',
    userSelect: 'none',
  });
  const slots = useMemo(
    () =>
      ({
        text: { color: 'inherit' },
        description: { color: 'neutralTertiary' },
      }) as const,
    []
  );

  return (
    <AriaCheckbox
      {...(filterStyleProps(otherProps) as AriaCheckboxProps)}
      className={classNames(styleProps.className, labelClassName)}
      style={styleProps.style}
    >
      {({ isIndeterminate }) => (
        <>
          <CheckboxIndicator
            isIndeterminate={isIndeterminate}
            prominence={prominence}
          />
          <SlotProvider slots={slots}>
            {children && (
              <Content>
                {isReactText(children) ? <Text>{children}</Text> : children}
              </Content>
            )}
          </SlotProvider>
        </>
      )}
    </AriaCheckbox>
  );
}

// Styled components
// -----------------------------------------------------------------------------

let sizeToken = tokenSchema.size.element.xsmall;
type IndicatorProps = Pick<CheckboxProps, 'isIndeterminate' | 'prominence'>;

/** @private A presentational checkbox indicator for state-managed checkbox primitives. */
export const CheckboxIndicator = (props: IndicatorProps) => {
  let { isIndeterminate, prominence } = props;

  return (
    <span
      data-prominence={prominence}
      className={classNames(
        css({
          backgroundColor: tokenSchema.color.background.canvas,
          borderRadius: tokenSchema.size.radius.small,
          color: tokenSchema.color.foreground.inverse,
          display: 'flex',
          flexShrink: 0,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          height: sizeToken,
          width: sizeToken,
          // marginBlock: `calc((${tokenSchema.size.element.regular} - ${tokenSchema.typography.text.regular.size}) / 2)`,

          // prominence
          '--selected-idle-bg': tokenSchema.color.scale.indigo9,
          '--selected-hover-bg': tokenSchema.color.scale.indigo10,
          '--selected-pressed-bg': tokenSchema.color.scale.indigo11,
          '&[data-prominence=low]': {
            '--selected-idle-bg': tokenSchema.color.scale.slate9,
            '--selected-hover-bg': tokenSchema.color.scale.slate10,
            '--selected-pressed-bg': tokenSchema.color.scale.slate11,
          },

          // indicator icons
          [checkboxClassList.selector('indicator')]: {
            opacity: 0,
            transform: `scale(0) translate3d(0, 0, 0)`,
            transition: transition(['opacity', 'transform']),
            willChange: 'opacity, transform',
          },

          // focus ring
          '::after': {
            borderRadius: `calc(${tokenSchema.size.alias.focusRingGap} + ${tokenSchema.size.radius.small})`,
            content: '""',
            inset: 0,
            margin: 0,
            position: 'absolute',
            transition: transition(['box-shadow', 'margin'], {
              easing: 'easeOut',
            }),
          },
          'input[type="checkbox"][data-focus=visible] + &::after': {
            boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
            margin: `calc(${tokenSchema.size.alias.focusRingGap} * -1)`,
          },
          'label[data-focus-visible] &::after': {
            boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
            margin: `calc(${tokenSchema.size.alias.focusRingGap} * -1)`,
          },

          // border / background
          '&::before': {
            border: `${tokenSchema.size.border.medium} solid ${tokenSchema.color.scale.slate8}`,
            borderRadius: `inherit`,
            content: '""',
            inset: 0,
            margin: 0,
            position: 'absolute',
            transition: transition(['border-color', 'border-width']),
          },

          'input[type="checkbox"]:disabled + &': {
            color: tokenSchema.color.alias.foregroundDisabled,
            '&::before': {
              backgroundColor: tokenSchema.color.alias.borderDisabled,
              borderColor: tokenSchema.color.alias.borderDisabled,
            },
          },
          'label[data-disabled] &': {
            color: tokenSchema.color.alias.foregroundDisabled,
            '&::before': {
              backgroundColor: tokenSchema.color.alias.borderDisabled,
              borderColor: tokenSchema.color.alias.borderDisabled,
            },
          },
          'input[type="checkbox"]:enabled:hover + &::before': {
            borderColor: tokenSchema.color.scale.slate9,
          },
          'label:not([data-disabled])[data-hovered] &::before': {
            borderColor: tokenSchema.color.scale.slate9,
          },
          'input[type="checkbox"]:enabled:active + &::before': {
            borderColor: tokenSchema.color.scale.slate10,
          },
          'label:not([data-disabled])[data-pressed] &::before': {
            borderColor: tokenSchema.color.scale.slate10,
          },

          // checked states
          'input[type="checkbox"]:checked + &, input[type="checkbox"]:indeterminate + &':
            {
              '&::before': {
                borderWidth: `calc(${sizeToken} / 2)`,
              },

              [checkboxClassList.selector('indicator')]: {
                opacity: 1,
                transform: `scale(1)`,
              },
            },
          'label[data-selected] &, label[data-indeterminate] &': {
            '&::before': {
              borderWidth: `calc(${sizeToken} / 2)`,
            },

            [checkboxClassList.selector('indicator')]: {
              opacity: 1,
              transform: `scale(1)`,
            },
          },
          'input[type="checkbox"]:enabled:checked + &::before, input[type="checkbox"]:enabled:indeterminate + &::before':
            {
              borderColor: 'var(--selected-idle-bg)',
            },
          'label:not([data-disabled])[data-selected] &::before, label:not([data-disabled])[data-indeterminate] &::before':
            {
              borderColor: 'var(--selected-idle-bg)',
            },
          'input[type="checkbox"]:enabled:checked:hover + &::before, input[type="checkbox"]:enabled:indeterminate:hover + &::before':
            {
              borderColor: 'var(--selected-hover-bg)',
            },
          'label:not([data-disabled])[data-hovered][data-selected] &::before, label:not([data-disabled])[data-hovered][data-indeterminate] &::before':
            {
              borderColor: 'var(--selected-hover-bg)',
            },
          'input[type="checkbox"]:enabled:checked:active + &::before, input[type="checkbox"]:enabled:indeterminate:active + &::before':
            {
              borderColor: 'var(--selected-pressed-bg)',
            },
          'label:not([data-disabled])[data-pressed][data-selected] &::before, label:not([data-disabled])[data-pressed][data-indeterminate] &::before':
            {
              borderColor: 'var(--selected-pressed-bg)',
            },
        })
      )}
    >
      {/* firefox has issues when transform combined with transition on SVG; circumvent with this wrapper */}
      <span className={checkboxClassList.element('indicator')}>
        <Icon
          size="small"
          src={isIndeterminate ? minusIcon : checkIcon}
          strokeScaling={false}
        />
      </span>
    </span>
  );
};

const Content = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={classNames(
        css({
          color: tokenSchema.color.alias.foregroundIdle,
          display: 'grid',
          gap: tokenSchema.size.space.large,
          // paddingTop: `calc((${tokenSchema.size.element.regular} - ${tokenSchema.typography.text.regular.capheight}) / 2)`,
          paddingTop: `calc((${sizeToken} - ${tokenSchema.typography.text.regular.capheight}) / 2)`,

          'input[type="checkbox"]:hover ~ &': {
            color: tokenSchema.color.alias.foregroundHovered,
          },

          'input[type="checkbox"]:disabled ~ &': {
            color: tokenSchema.color.alias.foregroundDisabled,
          },
          'label[data-hovered] &': {
            color: tokenSchema.color.alias.foregroundHovered,
          },
          'label[data-disabled] &': {
            color: tokenSchema.color.alias.foregroundDisabled,
          },
        })
      )}
      {...props}
    />
  );
};
