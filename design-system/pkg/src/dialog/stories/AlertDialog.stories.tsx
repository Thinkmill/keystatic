import { ActionButton } from '@keystar/ui/button';
import { action } from '@keystar/ui-storybook';

import { AlertDialog, AlertDialogProps, DialogTrigger } from '..';
import { getParagraph } from './common';

export default {
  title: 'Components/Dialog/AlertDialog',
};

export const Default = () =>
  renderAlert({
    title: 'Confirmation required',
    children: getParagraph(),
    primaryActionLabel: 'Accept',
    cancelLabel: 'Cancel',
    onPrimaryAction: action('primary'),
    onCancel: action('cancel'),
  });

Default.story = {
  name: 'default',
};

export const Critical = () =>
  renderAlert({
    tone: 'critical',
    title: 'Destructive action',
    children: getParagraph(),
    primaryActionLabel: 'Delete',
    cancelLabel: 'Cancel',
    onPrimaryAction: action('primary'),
    onCancel: action('cancel'),
  });

Critical.story = {
  name: 'critical',
};

export const PrimaryDisabled = () =>
  renderAlert({
    title: 'Primary disable',
    children: getParagraph(),
    primaryActionLabel: 'Accept',
    cancelLabel: 'Cancel',
    onPrimaryAction: action('primary'),
    onCancel: action('cancel'),
    isPrimaryActionDisabled: true,
  });

PrimaryDisabled.story = {
  name: 'primary disabled',
};

export const AutoFocusPrimary = () =>
  renderAlert({
    title: 'Auto-focus: primary',
    children: getParagraph(),
    primaryActionLabel: 'Accept',
    cancelLabel: 'Cancel',
    onPrimaryAction: action('primary'),
    onCancel: action('cancel'),
    autoFocusButton: 'primary',
  });

AutoFocusPrimary.story = {
  name: 'autoFocus primary',
};

export const AutoFocusCancel = () =>
  renderAlert({
    title: 'Auto-focus: cancel',
    children: getParagraph(),
    primaryActionLabel: 'Accept',
    cancelLabel: 'Cancel',
    onPrimaryAction: action('primary'),
    onCancel: action('cancel'),
    autoFocusButton: 'cancel',
  });

AutoFocusCancel.story = {
  name: 'autoFocus cancel',
};

function renderAlert({ ...props }: AlertDialogProps) {
  return (
    <DialogTrigger defaultOpen>
      <ActionButton>Open dialog</ActionButton>
      <AlertDialog
        {...props}
        onPrimaryAction={action('primary')}
        onCancel={props.onCancel}
      />
    </DialogTrigger>
  );
}
