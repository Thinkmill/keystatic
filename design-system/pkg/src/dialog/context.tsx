import React, { HTMLAttributes } from 'react';

import { DialogType } from './types';

export interface DialogContextValue extends HTMLAttributes<HTMLElement> {
  type: DialogType;
  isDismissable?: boolean;
  onClose: () => void;
}

export const DialogContext = React.createContext<DialogContextValue | null>(
  null
);
