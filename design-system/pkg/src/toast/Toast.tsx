import {
  Text as AriaText,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastStateContext as ToastStateContext,
} from 'react-aria-components/Toast';
import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';
import { useContext, useMemo } from 'react';

import { Button, ClearButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { alertTriangleIcon } from '@keystar/ui/icon/icons/alertTriangleIcon';
import { checkCircle2Icon } from '@keystar/ui/icon/icons/checkCircle2Icon';
import { infoIcon } from '@keystar/ui/icon/icons/infoIcon';
import { SlotProvider } from '@keystar/ui/slots';
import { css, tokenSchema, useMediaQuery } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { useProvider } from '../core';
import intlMessages from './l10n';
import { ToastProps } from './types';

const ICONS = {
  info: infoIcon,
  critical: alertTriangleIcon,
  positive: checkCircle2Icon,
};

export function Toast({ toast }: ToastProps) {
  let {
    key,
    content: { children, tone, actionLabel, onAction, shouldCloseOnAction },
  } = toast;
  let state = useContext(ToastStateContext);
  let stringFormatter = useLocalizedStringFormatter(intlMessages);
  let iconLabel = tone !== 'neutral' ? stringFormatter.format(tone) : undefined;
  let icon = tone !== 'neutral' ? ICONS[tone] : undefined;
  let colorScheme = useColorScheme();
  let staticColor: 'light' | 'dark' =
    tone === 'neutral' && colorScheme === 'dark' ? 'dark' : 'light';
  let slots = useMemo(() => ({ text: { color: 'inherit' } }) as const, []);

  let handleAction = () => {
    onAction?.();
    if (shouldCloseOnAction) state?.close(key);
  };

  return (
    <AriaToast
      toast={toast}
      data-tone={tone}
      className={css({
        borderRadius: tokenSchema.size.radius.regular,
        color: tokenSchema.color.foreground.onEmphasis,
        display: 'flex',
        margin: tokenSchema.size.space.large,
        maxWidth: tokenSchema.size.container.xsmall,
        minHeight: tokenSchema.size.element.large,
        padding: tokenSchema.size.space.regular,
        paddingInlineStart: tokenSchema.size.space.large,
        pointerEvents: 'auto',
        position: 'absolute',

        '&[data-tone=neutral]': {
          backgroundColor: tokenSchema.color.background.inverse,
          color: tokenSchema.color.foreground.inverse,
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
      })}
    >
      <SlotProvider slots={slots}>
        <AriaToastContent className={css({ display: 'flex' })}>
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
            className={css({
              alignItems: 'center',
              columnGap: tokenSchema.size.space.large,
              display: 'flex',
              flex: 1,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              paddingInlineEnd: tokenSchema.size.space.large,
            })}
          >
            <AriaText
              elementType="div"
              slot="title"
              className={css({
                flexGrow: 1,
                paddingBlock: tokenSchema.size.space.regular,
              })}
            >
              {isReactText(children) ? <Text>{children}</Text> : children}
            </AriaText>
            {actionLabel && (
              <Button onPress={handleAction} static={staticColor}>
                {actionLabel}
              </Button>
            )}
          </div>
        </AriaToastContent>
        <div
          className={css({
            borderInlineStart: `${tokenSchema.size.border.regular} solid var(--divider)`,
            paddingInlineStart: tokenSchema.size.space.regular,
            '--divider': 'color-mix(in srgb, transparent, currentColor 20%)',
          })}
        >
          <ClearButton slot="close" static={staticColor} />
        </div>
      </SlotProvider>
    </AriaToast>
  );
}

function useColorScheme(): 'light' | 'dark' {
  let prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  let preferred = useProvider();
  return preferred.colorScheme === 'auto'
    ? prefersDark
      ? 'dark'
      : 'light'
    : preferred.colorScheme;
}
