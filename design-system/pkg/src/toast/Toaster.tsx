import { UNSTABLE_ToastQueue as AriaToastQueue } from 'react-aria-components/Toast';
import { type ReactNode, useEffect, useRef, useSyncExternalStore } from 'react';
import { warning } from 'emery';

import { ToastContainer } from './ToastContainer';
import { ToasterProps, ToastOptions, ToastValue } from './types';

type CloseFunction = () => void;

function createToastQueue() {
  return new AriaToastQueue<ToastValue>({ maxVisibleToasts: 1 });
}

let globalToastQueue: ReturnType<typeof createToastQueue> | null = null;
function getGlobalToastQueue() {
  globalToastQueue ??= createToastQueue();
  return globalToastQueue;
}

/** @private For testing. */
export function clearToastQueue() {
  globalToastQueue = null;
}

let toastProviders = new Set<object>();
let subscriptions = new Set<() => void>();
function subscribe(fn: () => void) {
  subscriptions.add(fn);
  return () => subscriptions.delete(fn);
}
function getActiveToaster() {
  return toastProviders.values().next().value;
}

/** Renders the global RAC toast region. Only the first mounted instance is active. */
export function Toaster(props: ToasterProps) {
  let ref = useRef(null);
  toastProviders.add(ref);
  let activeToaster = useSyncExternalStore(
    subscribe,
    getActiveToaster,
    getActiveToaster
  );

  useEffect(() => {
    return () => {
      toastProviders.delete(ref);
      for (let fn of subscriptions) fn();
    };
  }, []);

  return ref === activeToaster ? (
    <ToastContainer queue={getGlobalToastQueue()} {...props} />
  ) : null;
}

function addToast(
  children: ReactNode,
  tone: ToastValue['tone'],
  options: ToastOptions = {}
): CloseFunction {
  if (typeof CustomEvent !== 'undefined' && typeof window !== 'undefined') {
    let event = new CustomEvent('keystar-ui-toast', {
      cancelable: true,
      bubbles: true,
      detail: { children, tone, options },
    });
    if (!window.dispatchEvent(event)) return () => {};
  }

  warning(
    options.timeout === undefined || options.timeout >= 5000,
    'Timeouts must be at least 5000ms, for accessibility.'
  );
  let timeout = options.timeout ? Math.max(options.timeout, 5000) : undefined;
  let queue = getGlobalToastQueue();
  let key = queue.add(
    {
      children,
      tone,
      actionLabel: options.actionLabel,
      onAction: options.onAction,
      shouldCloseOnAction: options.shouldCloseOnAction,
    },
    { timeout, onClose: options.onClose }
  );
  return () => queue.close(key);
}

export const toastQueue = {
  neutral: (children: ReactNode, options?: ToastOptions) =>
    addToast(children, 'neutral', options),
  positive: (children: ReactNode, options?: ToastOptions) =>
    addToast(children, 'positive', options),
  critical: (children: ReactNode, options?: ToastOptions) =>
    addToast(children, 'critical', options),
  info: (children: ReactNode, options?: ToastOptions) =>
    addToast(children, 'info', options),
};
