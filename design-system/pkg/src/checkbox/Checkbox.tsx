import { useCheckbox, useCheckboxGroupItem } from '@react-aria/checkbox';
import { useToggleState } from '@react-stately/toggle';
import {
  HTMLAttributes,
  InputHTMLAttributes,
  useContext,
  useMemo,
  useRef,
} from 'react';

import { Icon } from '@keystar/ui/icon';
import { checkIcon } from '@keystar/ui/icon/icons/checkIcon';
import { minusIcon } from '@keystar/ui/icon/icons/minusIcon';
import { SlotProvider } from '@keystar/ui/slots';
import {
  ClassList,
  FocusRing,
  classNames,
  css,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { CheckboxProps } from './types';
import { CheckboxGroupContext } from './context';

const checkboxClassList = new ClassList('Checkbox', ['indicator']);

export function Checkbox(props: CheckboxProps) {
  let groupState = useContext(CheckboxGroupContext);
  return groupState ? (
    <CheckboxInGroup groupState={groupState} {...props} />
  ) : (
    <CheckboxAlone {...props} />
  );
}

function CheckboxInGroup({
  groupState,
  ...props
}: CheckboxProps & { groupState: CheckboxGroupContext }) {
  let inputRef = useRef<HTMLInputElement>(null);
  const { inputProps } = useCheckboxGroupItem(
    {
      ...props,
      // Value is optional for standalone checkboxes, but required for
      // CheckboxGroup items; it's passed explicitly here to avoid
      // typescript error (requires ignore).
      // @ts-ignore
      value: props.value,
    },
    groupState.state,
    inputRef
  );
  return (
    <CheckboxInner inputRef={inputRef} inputProps={inputProps} {...props} />
  );
}

function CheckboxAlone(props: CheckboxProps) {
  let inputRef = useRef<HTMLInputElement>(null);
  const { inputProps } = useCheckbox(props, useToggleState(props), inputRef);
  return (
    <CheckboxInner inputRef={inputRef} inputProps={inputProps} {...props} />
  );
}

function CheckboxInner(
  props: CheckboxProps & {
    inputRef: React.RefObject<HTMLInputElement>;
    inputProps: InputHTMLAttributes<HTMLInputElement>;
  }
) {
  let {
    autoFocus,
    children,
    inputProps,
    inputRef,
    isDisabled = false,
    isIndeterminate = false,
    prominence,
    ...otherProps
  } = props;

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
    <label
      data-disabled={isDisabled}
      className={classNames(styleProps.className, labelClassName)}
      style={styleProps.style}
    >
      <FocusRing autoFocus={autoFocus}>
        <input
          {...inputProps}
          ref={inputRef}
          className={classNames(
            css({
              position: 'absolute',
              zIndex: 1,
              inset: 0,
              insetInlineStart: `calc(${tokenSchema.size.space.regular} * -1)`,
              opacity: 0.0001,
            })
          )}
        />
      </FocusRing>
      <Indicator isIndeterminate={isIndeterminate} prominence={prominence} />
      <SlotProvider slots={slots}>
        {children && (
          <Content>
            {isReactText(children) ? <Text>{children}</Text> : children}
          </Content>
        )}
      </SlotProvider>
    </label>
  );
}

// Styled components
// -----------------------------------------------------------------------------

let sizeToken = tokenSchema.size.element.xsmall;
type IndicatorProps = Pick<CheckboxProps, 'isIndeterminate' | 'prominence'>;

const Indicator = (props: IndicatorProps) => {
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
          'input[type="checkbox"]:enabled:hover + &::before': {
            borderColor: tokenSchema.color.scale.slate9,
          },
          'input[type="checkbox"]:enabled:active + &::before': {
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
          'input[type="checkbox"]:enabled:checked + &::before, input[type="checkbox"]:enabled:indeterminate + &::before':
            {
              borderColor: 'var(--selected-idle-bg)',
            },
          'input[type="checkbox"]:enabled:checked:hover + &::before, input[type="checkbox"]:enabled:indeterminate:hover + &::before':
            {
              borderColor: 'var(--selected-hover-bg)',
            },
          'input[type="checkbox"]:enabled:checked:active + &::before, input[type="checkbox"]:enabled:indeterminate:active + &::before':
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
        })
      )}
      {...props}
    />
  );
};
