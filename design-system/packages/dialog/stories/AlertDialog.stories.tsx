import { storiesOf, action } from '@voussoir/storybook';

import { ActionButton } from '@voussoir/button';

import { AlertDialog, AlertDialogProps, DialogTrigger } from '../src';
import { getParagraph } from './common';

storiesOf('Components/Dialog/AlertDialog', module)
  .add('default', () =>
    renderAlert({
      title: 'Confirmation required',
      children: getParagraph(),
      primaryActionLabel: 'Accept',
      cancelLabel: 'Cancel',
      onPrimaryAction: action('primary'),
      onCancel: action('cancel'),
    })
  )
  .add('critical', () =>
    renderAlert({
      tone: 'critical',
      title: 'Destructive action',
      children: getParagraph(),
      primaryActionLabel: 'Delete',
      cancelLabel: 'Cancel',
      onPrimaryAction: action('primary'),
      onCancel: action('cancel'),
    })
  )
  .add('primary disabled', () =>
    renderAlert({
      title: 'Primary disable',
      children: getParagraph(),
      primaryActionLabel: 'Accept',
      cancelLabel: 'Cancel',
      onPrimaryAction: action('primary'),
      onCancel: action('cancel'),
      isPrimaryActionDisabled: true,
    })
  )
  .add('autoFocus primary', () =>
    renderAlert({
      title: 'Auto-focus: primary',
      children: getParagraph(),
      primaryActionLabel: 'Accept',
      cancelLabel: 'Cancel',
      onPrimaryAction: action('primary'),
      onCancel: action('cancel'),
      autoFocusButton: 'primary',
    })
  )
  .add('autoFocus cancel', () =>
    renderAlert({
      title: 'Auto-focus: cancel',
      children: getParagraph(),
      primaryActionLabel: 'Accept',
      cancelLabel: 'Cancel',
      onPrimaryAction: action('primary'),
      onCancel: action('cancel'),
      autoFocusButton: 'cancel',
    })
  );

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
