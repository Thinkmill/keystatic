import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@voussoir/button';
// import { Text } from '@voussoir/typography';

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
      <Button>Trigger</Button>
      <AlertDialog
        {...props}
        onPrimaryAction={action('primary')}
        onCancel={props.onCancel}
      />
    </DialogTrigger>
  );
}
