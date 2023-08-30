import { AriaDialogProps, useDialog } from '@react-aria/dialog';
import { useLocale } from '@react-aria/i18n';
import {
  DatePickerState,
  DateRangePickerState,
} from '@react-stately/datepicker';
import { ReactNode, useRef } from 'react';

import { Popover, Tray } from '@keystar/ui/overlays';
import { css, tokenSchema, useIsMobileDevice } from '@keystar/ui/style';

export function DatePickerPopover({
  state,
  ...props
}: {
  children: ReactNode;
  dialogProps: AriaDialogProps;
  shouldFlip?: boolean;
  state: DatePickerState | DateRangePickerState;
  triggerRef: React.RefObject<HTMLElement>;
}) {
  let scrollRef = useRef<HTMLDivElement>(null);
  let { direction } = useLocale();
  let isMobile = useIsMobileDevice();
  let { dialogProps } = useDialog(props.dialogProps, scrollRef);

  let content = (
    <div
      ref={scrollRef}
      className={css({
        display: 'flex',
        justifyContent: 'center',
        maxHeight: 'inherit',
        outline: 0,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      })}
      {...dialogProps}
    >
      <div
        className={css({
          paddingInline: tokenSchema.size.space.medium,
          paddingTop: tokenSchema.size.space.medium,
          // bottom-padding fix for the scrollable area
          '&::after': {
            content: '""',
            display: 'block',
            height: tokenSchema.size.space.medium,
          },
        })}
      >
        {props.children}
      </div>
    </div>
  );

  let overlay;
  if (isMobile) {
    overlay = <Tray state={state}>{content}</Tray>;
  } else {
    overlay = (
      <Popover
        hideArrow
        placement={direction === 'rtl' ? 'bottom right' : 'bottom left'}
        scrollRef={scrollRef}
        shouldFlip={props.shouldFlip}
        state={state}
        triggerRef={props.triggerRef}
      >
        {content}
      </Popover>
    );
  }

  return overlay;
}
