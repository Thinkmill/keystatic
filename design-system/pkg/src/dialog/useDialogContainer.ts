import { assert } from 'emery';
import { useContext } from 'react';

import { DialogContext } from './context';

export interface DialogContainerValue {
  type: 'modal' | 'popover' | 'tray' | 'fullscreen';
  dismiss(): void;
}

/** A dialog may be abstracted from its trigger; this hook provides access to context. */
export function useDialogContainer(): DialogContainerValue {
  const context = useContext(DialogContext);

  assert(
    !!context,
    'Cannot call `useDialogContext` outside of `<DialogTrigger>` or `<DialogContainer>`.'
  );

  return {
    type: context.type,
    dismiss() {
      context.onClose();
    },
  };
}
