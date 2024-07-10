import { ReactElement, ReactNode, RefObject } from 'react';
import { AriaLabelingProps, DOMProps } from '@react-types/shared';

import { OverlayTriggerProps, PositionProps } from '@keystar/ui/overlays';
import { BaseStyleProps } from '@keystar/ui/style';
import { OverlayTriggerState } from '@react-stately/overlays';

export type DialogType = 'modal' | 'popover' | 'tray' | 'fullscreen';
export type DialogSize = 'small' | 'medium' | 'large';

export interface DialogContainerValue {
  type: DialogType;
  dismiss(): void;
}

export type DialogTriggerBase = {
  type: DialogType;
  state: OverlayTriggerState;
  isDismissable?: boolean;
  dialogProps?: DialogProps | {};
  triggerProps?: any;
  hideArrow?: boolean;
  overlay: ReactElement;
  trigger: ReactElement;
};

// -----------------------------------------------------------------------------

export type DialogRenderFn = (close: () => void) => ReactElement;

export type DialogTriggerProps = {
  /** The dialog and its trigger element. */
  children: [ReactElement, DialogRenderFn | ReactElement];
  /**
   * The type of dialog that should be rendered.
   * @default 'modal'
   */
  type?: DialogType;
  /** The type of Dialog that should be rendered when on a mobile device. See DialogTrigger [types section](#dialog-types) for an explanation on each. */
  mobileType?: Exclude<DialogType, 'popover'>;
  /** Whether a "popover" type dialog's arrow should be hidden. */
  hideArrow?: boolean;
  /**
   * The ref of the element the dialog should visually attach itself to.
   * Defaults to the trigger button if not defined.
   */
  targetRef?: RefObject<HTMLElement>;
  /** Whether a "modal" type dialog should be dismissable. */
  isDismissable?: boolean;
  /** Whether pressing the escape key to close the dialog should be disabled. */
  isKeyboardDismissDisabled?: boolean;
} & OverlayTriggerProps &
  PositionProps;

export interface DialogContainerProps {
  /** The dialog to display, if any. */
  children: Exclude<ReactNode, Iterable<ReactNode>> | string;
  /** Handler that is called when the [×] button of a dismissable dialog is clicked. */
  onDismiss: () => void;
  /**
   * The type of dialog that should be rendered.
   * @default 'modal'
   */
  type?: 'modal' | 'fullscreen';
  /** Whether the dialog is dismissable. */
  isDismissable?: boolean;
  /** Whether pressing the escape key to close the dialog should be disabled. */
  isKeyboardDismissDisabled?: boolean;
}

export type AriaDialogProps = {
  /**
   * The accessibility role for the dialog.
   * @default 'dialog'
   */
  role?: 'dialog' | 'alertdialog';
} & DOMProps &
  AriaLabelingProps;

export type DialogProps = {
  /** The contents of the Dialog. */
  children: ReactNode;
  /** The size of the Dialog. Only applies to "modal" type Dialogs. */
  size?: DialogSize;
  /** Whether the Dialog is dismissable. See the [examples](#examples) for more details. */
  isDismissable?: boolean;
  /** Handler that is called when the 'x' button of a dismissable Dialog is clicked. */
  onDismiss?: () => void;
} & AriaDialogProps &
  BaseStyleProps;

export type AlertDialogProps = {
  /**
   * The tone of the dialog.
   * @default 'neutral'
   */
  tone?: 'neutral' | 'critical';
  /** The title of the dialog. */
  title: string;
  /** The contents of the dialog. */
  children: ReactNode;
  /** The label to display within the cancel button. */
  cancelLabel?: string;
  /** The label to display within the confirm button. */
  primaryActionLabel: string;
  /** The label to display within the secondary button. */
  secondaryActionLabel?: string;
  /** Whether the primary button is disabled. */
  isPrimaryActionDisabled?: boolean;
  /** Whether the secondary button is disabled. */
  isSecondaryActionDisabled?: boolean;
  /** Handler that is called when the cancel button is pressed. */
  onCancel?: () => void;
  /** Handler that is called when the primary button is pressed. */
  onPrimaryAction?: () => void;
  /** Handler that is called when the secondary button is pressed. */
  onSecondaryAction?: () => void;
  /** Button to focus by default when the dialog opens. */
  autoFocusButton?: 'cancel' | 'primary' | 'secondary';
} & DOMProps &
  BaseStyleProps;
