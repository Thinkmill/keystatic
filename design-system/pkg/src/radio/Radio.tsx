import {
  Radio as AriaRadio,
  type RadioProps as AriaRadioProps,
} from 'react-aria-components/RadioGroup';
import { HTMLAttributes, useMemo } from 'react';

import { SlotProvider } from '@keystar/ui/slots';
import {
  ClassList,
  classNames,
  css,
  filterStyleProps,
  resetClassName,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { RadioProps } from './types';

const radioClassList = new ClassList('Radio', ['indicator']);

export function Radio(props: RadioProps) {
  let { children, ...otherProps } = props;
  let styleProps = useStyleProps(otherProps);
  const labelClassName = css({
    alignItems: 'flex-start',
    display: 'inline-flex',
    gap: tokenSchema.size.space.regular,
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
    <AriaRadio
      {...(filterStyleProps(otherProps) as AriaRadioProps)}
      className={classNames(styleProps.className, labelClassName)}
      style={styleProps.style}
    >
      <Indicator />
      <SlotProvider slots={slots}>
        {children && (
          <Content>
            {isReactText(children) ? <Text>{children}</Text> : children}
          </Content>
        )}
      </SlotProvider>
    </AriaRadio>
  );
}

// Styled components
// -----------------------------------------------------------------------------

let sizeToken = tokenSchema.size.element.xsmall;
const Indicator = () => {
  return (
    <span
      className={classNames(
        css({
          backgroundColor: tokenSchema.color.background.canvas,
          borderRadius: tokenSchema.size.radius.full,
          color: tokenSchema.color.foreground.onEmphasis,
          display: 'flex',
          flexShrink: 0,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          height: sizeToken,
          width: sizeToken,

          // indicator icons
          [radioClassList.selector('indicator')]: {
            opacity: 0,
            transform: `scale(0) translate3d(0, 0, 0)`,
            transition: transition(['opacity', 'transform']),
            willChange: 'opacity, transform',
          },

          // focus ring
          '::after': {
            borderRadius: tokenSchema.size.radius.full,
            content: '""',
            inset: 0,
            margin: 0,
            position: 'absolute',
            transition: transition(['box-shadow', 'margin'], {
              easing: 'easeOut',
            }),
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
            transition: transition(['border-color', 'border-width'], {
              duration: 'regular',
            }),
          },

          'label[data-disabled] &': {
            color: tokenSchema.color.alias.foregroundDisabled,
            '&::before': {
              backgroundColor: tokenSchema.color.alias.borderDisabled,
              borderColor: tokenSchema.color.alias.borderDisabled,
            },
          },
          'label:not([data-disabled])[data-hovered] &::before': {
            borderColor: tokenSchema.color.scale.slate9,
          },
          'label:not([data-disabled])[data-pressed] &::before': {
            borderColor: tokenSchema.color.scale.slate10,
          },

          // checked states
          'label[data-selected] &': {
            '&::before': {
              borderWidth: `calc(${sizeToken} / 2)`,
            },

            [radioClassList.selector('indicator')]: {
              opacity: 1,
              transform: `scale(1)`,
            },
          },
          'label:not([data-disabled])[data-selected] &::before': {
            borderColor: tokenSchema.color.scale.indigo9,
          },
          'label:not([data-disabled])[data-selected][data-hovered] &::before': {
            borderColor: tokenSchema.color.scale.indigo10,
          },
          'label:not([data-disabled])[data-selected][data-pressed] &::before': {
            borderColor: tokenSchema.color.scale.indigo11,
          },
        })
      )}
    >
      {/* firefox has issues when transform combined with transition on SVG; circumvent with this wrapper */}
      <span className={radioClassList.element('indicator')}>
        <svg
          className={resetClassName}
          fill="currentColor"
          height={12}
          viewBox="0 0 24 24"
          width={12}
        >
          <circle cx="12" cy="12" r="6" />
        </svg>
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
          paddingTop: `calc((${sizeToken} - ${tokenSchema.typography.text.regular.capheight}) / 2)`,
          gap: tokenSchema.size.space.large,

          'input[type="radio"]:hover ~ &': {
            color: tokenSchema.color.alias.foregroundHovered,
          },

          'input[type="radio"]:disabled ~ &': {
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
