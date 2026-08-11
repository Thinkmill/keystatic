import type {
  QueuedToast,
  ToastOptions as AriaToastOptions,
  ToastRegionProps,
} from 'react-aria-components/Toast';
import type { ReactNode } from 'react';

export type ToasterProps = Omit<
  ToastRegionProps<ToastValue>,
  'children' | 'className' | 'queue' | 'style'
> & {
  placement?: 'start' | 'end' | 'center';
  position?: 'top' | 'bottom';
};

export type ToastOptions = Omit<AriaToastOptions, 'priority'> & {
  actionLabel?: ReactNode;
  onAction?: () => void;
  shouldCloseOnAction?: boolean;
};

export type ToastValue = {
  children: ReactNode;
  tone: 'info' | 'critical' | 'neutral' | 'positive';
  actionLabel?: ReactNode;
  onAction?: () => void;
  shouldCloseOnAction?: boolean;
};

export type ToastProps = {
  toast: QueuedToast<ToastValue>;
};

export type ToastContainerProps = ToasterProps & {
  queue: ToastRegionProps<ToastValue>['queue'];
};
