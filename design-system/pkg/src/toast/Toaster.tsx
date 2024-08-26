import { ToastQueue, useToastQueue } from '@react-stately/toast';
import React, {
  ReactNode,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react';
import { warning } from 'emery';

import { Toast } from './Toast';
import { ToastContainer } from './ToastContainer';
import { ToasterProps, ToastOptions, ToastValue } from './types';

type CloseFunction = () => void;

// There is a single global toast queue instance for the whole app, initialized lazily.
let globalToastQueue: ToastQueue<ToastValue> | null = null;
function getGlobalToastQueue() {
  if (!globalToastQueue) {
    globalToastQueue = new ToastQueue({
      maxVisibleToasts: 1,
      hasExitAnimation: true,
    });
  }

  return globalToastQueue;
}

/** @private For testing. */
export function clearToastQueue() {
  globalToastQueue = null;
}

let toastProviders = new Set();
let subscriptions = new Set<() => void>();
function subscribe(fn: () => void) {
  subscriptions.add(fn);
  return () => subscriptions.delete(fn);
}

function getActiveToaster() {
  return toastProviders.values().next().value;
}

function useActiveToaster() {
  return useSyncExternalStore(subscribe, getActiveToaster, getActiveToaster);
}

/**
 * A Toaster renders the queued toasts in an application. It should be
 * placed at the root of the app.
 */
export function Toaster(props: ToasterProps) {
  // Track all toast provider instances in a set.
  // Only the first one will actually render.
  // We use a ref to do this, since it will have a stable identity
  // over the lifetime of the component.
  let ref = useRef();
  toastProviders.add(ref);

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      // When this toast provider unmounts, reset all animations so that
      // when the new toast provider renders, it is seamless.
      for (let toast of getGlobalToastQueue().visibleToasts) {
        toast.animation = undefined;
      }

      // Remove this toast provider, and call subscriptions.
      // This will cause all other instances to re-render,
      // and the first one to become the new active toast provider.
      toastProviders.delete(ref);
      for (let fn of subscriptions) {
        fn();
      }
    };
  }, []);

  // Only render if this is the active toast provider instance, and there are visible toasts.
  let activeToaster = useActiveToaster();
  let state = useToastQueue(getGlobalToastQueue());
  if (ref === activeToaster && state.visibleToasts.length > 0) {
    return (
      <ToastContainer state={state} {...props}>
        {state.visibleToasts.map(toast => (
          <Toast key={toast.key} toast={toast} state={state} />
        ))}
      </ToastContainer>
    );
  }

  return null;
}

function addToast(
  children: ReactNode,
  tone: ToastValue['tone'],
  options: ToastOptions = {}
): CloseFunction {
  // Dispatch a custom event so that toasts can be intercepted and re-targeted, e.g. when inside an iframe.
  if (typeof CustomEvent !== 'undefined' && typeof window !== 'undefined') {
    let event = new CustomEvent('keystar-ui-toast', {
      cancelable: true,
      bubbles: true,
      detail: {
        children,
        tone,
        options,
      },
    });

    let shouldContinue = window.dispatchEvent(event);
    if (!shouldContinue) {
      return () => {};
    }
  }

  let value = {
    children,
    tone,
    actionLabel: options.actionLabel,
    onAction: options.onAction,
    shouldCloseOnAction: options.shouldCloseOnAction,
  };

  warning(
    typeof options.timeout === 'number' && options.timeout >= 5000,
    'Timeouts must be at least 5000ms, for accessibility.'
  );
  let timeout = options.timeout ? Math.max(options.timeout, 5000) : undefined;
  let queue = getGlobalToastQueue();
  let key = queue.add(value, {
    priority: getPriority(tone, options),
    timeout,
    onClose: options.onClose,
  });
  return () => queue.close(key);
}

export const toastQueue = {
  /** Queues a neutral toast. */
  neutral(children: ReactNode, options: ToastOptions = {}): CloseFunction {
    return addToast(children, 'neutral', options);
  },
  /** Queues a positive toast. */
  positive(children: ReactNode, options: ToastOptions = {}): CloseFunction {
    return addToast(children, 'positive', options);
  },
  /** Queues a critical toast. */
  critical(children: ReactNode, options: ToastOptions = {}): CloseFunction {
    return addToast(children, 'critical', options);
  },
  /** Queues an informational toast. */
  info(children: ReactNode, options: ToastOptions = {}): CloseFunction {
    return addToast(children, 'info', options);
  },
};

// TODO: if a lower priority toast comes in, no way to know until you dismiss
// the higher priority one.
const PRIORITY = {
  // actionable toasts gain 4 priority points. make sure critical toasts are
  // always at the top.
  critical: 10,
  positive: 3,
  info: 2,
  neutral: 1,
};

function getPriority(tone: ToastValue['tone'], options: ToastOptions) {
  let priority = PRIORITY[tone] || 1;
  if (options.onAction) {
    priority += 4;
  }
  return priority;
}
