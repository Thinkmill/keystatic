import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useToast } from '@react-aria/toast';
import { useObjectRef } from '@react-aria/utils';
import { ForwardedRef, forwardRef, useMemo } from 'react';

import { Button, ClearButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { checkCircle2Icon } from '@keystar/ui/icon/icons/checkCircle2Icon';
import { infoIcon } from '@keystar/ui/icon/icons/infoIcon';
import { alertTriangleIcon } from '@keystar/ui/icon/icons/alertTriangleIcon';
import { SlotProvider } from '@keystar/ui/slots';
import {
  classNames,
  css,
  keyframes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import intlMessages from './l10n';
import { ToastProps } from './types';

const ICONS = {
  info: infoIcon,
  critical: alertTriangleIcon,
  // neutral: infoIcon,
  positive: checkCircle2Icon,
};

function Toast(props: ToastProps, ref: ForwardedRef<HTMLDivElement>) {
  let {
    toast: {
      key,
      animation,
      content: { children, tone, actionLabel, onAction, shouldCloseOnAction },
    },
    state,
    ...otherProps
  } = props;
  let domRef = useObjectRef(ref);
  let { closeButtonProps, titleProps, toastProps, contentProps } = useToast(
    props,
    state,
    domRef
  );
  let styleProps = useStyleProps(otherProps);

  let stringFormatter = useLocalizedStringFormatter(intlMessages);
  let iconLabel =
    tone && tone !== 'neutral' ? stringFormatter.format(tone) : null;
  let icon = tone && tone !== 'neutral' ? ICONS[tone] : null;

  const handleAction = () => {
    if (onAction) {
      onAction();
    }

    if (shouldCloseOnAction) {
      state.close(key);
    }
  };
  let slots = useMemo(
    () =>
      ({
        text: { color: 'inherit' },
      }) as const,
    []
  );

  return (
    <div
      {...styleProps}
      {...toastProps}
      ref={domRef}
      data-tone={tone}
      className={classNames(
        css({
          borderRadius: tokenSchema.size.radius.regular,
          display: 'flex',
          margin: tokenSchema.size.space.large,
          maxWidth: tokenSchema.size.container.xsmall,
          minHeight: tokenSchema.size.element.large,
          padding: tokenSchema.size.space.regular,
          paddingInlineStart: tokenSchema.size.space.large,
          pointerEvents: 'auto',
          position: 'absolute',

          // tones
          color: tokenSchema.color.foreground.onEmphasis,
          '&[data-tone=neutral]': {
            background: tokenSchema.color.scale['slate9'],
          },
          '&[data-tone=info]': {
            background: tokenSchema.color.background.accentEmphasis,
          },
          '&[data-tone=positive]': {
            background: tokenSchema.color.background.positiveEmphasis,
          },
          '&[data-tone=critical]': {
            background: tokenSchema.color.background.criticalEmphasis,
          },

          // animations
          '&[data-animation=entering]': {
            animation: `${slideInAnim} 300ms`,
          },
          '&[data-animation=exiting]': {
            animation: `${fadeOutAnim} 300ms forwards`,
          },
        }),
        styleProps.className
      )}
      style={{
        ...styleProps.style,
        zIndex: props.toast.priority,
      }}
      data-animation={animation}
      onAnimationEnd={() => {
        if (animation === 'exiting') {
          state.remove(key);
        }
      }}
    >
      <SlotProvider slots={slots}>
        <div {...contentProps} className={css({ display: 'flex' })}>
          {icon && (
            <Icon
              aria-label={iconLabel}
              src={icon}
              size="medium"
              marginTop="small"
              marginEnd="regular"
            />
          )}
          <div
            className={classNames(
              css({
                alignItems: 'center',
                display: 'flex',
                columnGap: tokenSchema.size.space.large,
                flex: 1,
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                paddingInlineEnd: tokenSchema.size.space.large,
              })
            )}
          >
            <div
              className={classNames(
                css({
                  flexGrow: 1,
                  paddingBlock: tokenSchema.size.space.regular,
                })
              )}
              {...titleProps}
            >
              {isReactText(children) ? <Text>{children}</Text> : children}
            </div>
            {actionLabel && (
              <Button
                onPress={handleAction}
                // prominence="low"
                static="light"
                // tone="secondary"
                // staticColor="white"
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
        <div
          className={css({
            borderInlineStart: `${tokenSchema.size.border.regular} solid #fff3`,
            paddingInlineStart: tokenSchema.size.space.regular,
          })}
        >
          <ClearButton static="light" {...closeButtonProps} />
        </div>
      </SlotProvider>
    </div>
  );
}

let slideInAnim = keyframes({
  from: { transform: `var(--slide-from)` },
  to: { transform: `var(--slide-to)` },
});
let fadeOutAnim = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

let _Toast = forwardRef(Toast);
export { _Toast as Toast };
