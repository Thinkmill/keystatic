import { chain } from '@react-aria/utils';
import { action, storiesOf } from '@voussoir/storybook';
import { useRef } from 'react';

import { ActionButton, Button, ButtonGroup } from '@voussoir/button';
import { Flex } from '@voussoir/layout';
import { Content, Header } from '@voussoir/slots';
import { Heading, Text } from '@voussoir/typography';

import { AlertDialog, Dialog, DialogTrigger, DialogTriggerProps } from '../src';
import { getParagraph } from './common';

storiesOf('Components/Dialog/DialogTrigger', module)
  .add('default', () => render({}))
  .add('type: popover', () => renderPopover({ type: 'popover' }))
  .add('type: modal', () => render({ type: 'modal' }))
  .add('type: modal isDismissable', () =>
    render({ type: 'modal', isDismissable: true })
  )
  .add('type: fullscreen', () => render({ type: 'fullscreen' }))
  .add('type: tray', () => renderPopover({ type: 'tray' }))
  .add('mobileType: fullscreen', () =>
    render({ type: 'modal', mobileType: 'fullscreen' })
  )
  .add('popover with mobileType: modal', () =>
    renderPopover({ mobileType: 'modal' })
  )
  .add('popover with mobileType: tray', () =>
    renderPopover({ mobileType: 'tray' })
  )
  .add('nested modals', () => (
    <div style={{ paddingTop: 100 }}>
      <input />
      <DialogTrigger isDismissable>
        <ActionButton>Open dialog</ActionButton>
        <Dialog>
          <Content>
            <input />
            <input />
            <DialogTrigger isDismissable>
              <ActionButton>Open dialog</ActionButton>
              <Dialog>
                <Content>
                  <input />
                  <input />
                </Content>
              </Dialog>
            </DialogTrigger>
          </Content>
        </Dialog>
      </DialogTrigger>
    </div>
  ))
  .add('nested popovers', () => (
    <div style={{ paddingTop: 100 }}>
      <DialogTrigger type="popover">
        <ActionButton>Open dialog</ActionButton>
        <Dialog>
          <Content>
            <input />
            <input />
            <DialogTrigger type="popover">
              <ActionButton>Open dialog</ActionButton>
              <Dialog>
                <Content>Hi!</Content>
              </Dialog>
            </DialogTrigger>
          </Content>
        </Dialog>
      </DialogTrigger>
    </div>
  ))
  .add('popover inside scroll view', () => (
    <div style={{ height: 100, display: 'flex' }}>
      <div style={{ paddingTop: 100, height: 100, overflow: 'auto' }}>
        <div style={{ height: 200 }}>
          <DialogTrigger type="popover">
            <ActionButton>Open dialog</ActionButton>
            <Dialog>
              <Content>
                <input />
                <input />
              </Content>
            </Dialog>
          </DialogTrigger>
        </div>
      </div>
      <div style={{ paddingTop: 100, height: 100, overflow: 'auto', flex: 1 }}>
        <div style={{ height: 200 }}>scroll around</div>
      </div>
    </div>
  ))
  .add('offset', () => renderPopover({ offset: 50 }))
  .add('crossOffset', () => renderPopover({ crossOffset: 50 }))
  .add('shouldFlip: true', () =>
    renderPopover({
      placement: 'start',
      shouldFlip: true,
      width: 'calc(100vh - 100px)',
    })
  )
  .add('shouldFlip: false', () =>
    renderPopover({
      placement: 'start',
      shouldFlip: false,
      width: 'calc(100vh - 100px)',
    })
  )
  .add('shouldFlip: true with offset', () =>
    renderPopover({
      placement: 'start',
      shouldFlip: true,
      offset: 50,
      width: 'calc(100vh - 100px)',
    })
  )
  .add('keyboard dismiss disabled: modal', () =>
    render({ type: 'modal', isKeyboardDismissDisabled: true })
  )
  .add('keyboard dismiss disabled: popover', () =>
    renderPopover({
      placement: 'bottom',
      isKeyboardDismissDisabled: true,
    })
  )
  .add('keyboard dismiss disabled: tray', () =>
    renderPopover({ type: 'tray', isKeyboardDismissDisabled: true })
  )
  .add('containerPadding', () =>
    renderPopover({
      placement: 'bottom',
      width: 'calc(100vh - 100px)',
      containerPadding: 200,
    })
  )
  .add('close function with button: popover', () => (
    <div style={{ display: 'flex', margin: '100px 0' }}>
      <DialogTrigger type="popover" onOpenChange={action('open change')}>
        <ActionButton>Open dialog</ActionButton>
        {close => (
          <Dialog>
            <Heading>Dialog title</Heading>
            <Header>
              <Text size="small" color="neutralSecondary">
                Optional header content
              </Text>
            </Header>
            <Content>
              <Text>{getParagraph(3)}</Text>
            </Content>
            <ButtonGroup>
              <Button onPress={chain(close, action('cancel'))}>Cancel</Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogTrigger>
    </div>
  ))
  .add('targetRef', () => <TriggerWithRef type="popover" />)
  .add('alert dialog', () => renderAlert({}))
  .add('crossoffset examples', () => (
    <Flex gap="regular" alignSelf="center">
      <Flex gap="regular" direction="column" alignItems="start">
        <span>Left Top</span>
        <div>
          <span>-50</span>
          {renderPopover({ placement: 'left top', crossOffset: -50 }, false)}
        </div>
        <div>
          <span>0</span>
          {renderPopover({ placement: 'left top' }, false)}
        </div>
        <div>
          <span>50</span>
          {renderPopover({ placement: 'left top', crossOffset: 50 }, false)}
        </div>
      </Flex>
      <Flex gap="regular" direction="column" alignItems="start">
        <span>Left</span>
        <div>
          <span>-50</span>
          {renderPopover({ placement: 'left', crossOffset: -50 }, false)}
        </div>
        <div>
          <span>0</span>
          {renderPopover({ placement: 'left' }, false)}
        </div>
        <div>
          <span>50</span>
          {renderPopover({ placement: 'left', crossOffset: 50 }, false)}
        </div>
      </Flex>
      <Flex gap="regular" direction="column" alignItems="start">
        <span>Left Bottom</span>
        <div>
          <span>-50</span>
          {renderPopover({ placement: 'left bottom', crossOffset: -50 }, false)}
        </div>
        <div>
          <span>0</span>
          {renderPopover({ placement: 'left bottom' }, false)}
        </div>
        <div>
          <span>50</span>
          {renderPopover({ placement: 'left bottom', crossOffset: 50 }, false)}
        </div>
      </Flex>
    </Flex>
  ))
  .add('trigger visible through underlay', () => renderTriggerNotCentered({}))
  .add('2 popovers', () => (
    <Flex gap="regular">
      <DialogTrigger type="popover">
        <ActionButton>Open dialog</ActionButton>
        <Dialog>
          <Content>
            <input />
            <input />
          </Content>
        </Dialog>
      </DialogTrigger>
      <DialogTrigger type="popover">
        <ActionButton>Open dialog</ActionButton>
        <Dialog>
          <Content>Hi!</Content>
        </Dialog>
      </DialogTrigger>
    </Flex>
  ));

function render({ width = 'auto', ...props }) {
  return (
    <div style={{ display: 'flex', width, margin: '100px 0' }}>
      <DialogTrigger {...props} onOpenChange={action('open change')}>
        <ActionButton>Open dialog</ActionButton>
        {close => (
          <Dialog>
            <Heading>Dialog title</Heading>
            <Header>
              <Text size="small" color="neutralSecondary">
                Optional header content
              </Text>
            </Header>
            <Content>
              <Text>{getParagraph(3)}</Text>
            </Content>
            {!props.isDismissable && (
              <ButtonGroup>
                <Button onPress={chain(close, action('cancel'))}>Cancel</Button>
                <Button
                  prominence="high"
                  onPress={chain(close, action('confirm'))}
                >
                  Confirm
                </Button>
              </ButtonGroup>
            )}
          </Dialog>
        )}
      </DialogTrigger>
    </div>
  );
}

function renderTriggerNotCentered(props: Partial<DialogTriggerProps>) {
  return (
    <div style={{ position: 'absolute', top: '100px', left: '100px' }}>
      <div>
        action button shouldn't get any events if the underlay is up and you try
        to click it through the underlay
      </div>
      <DialogTrigger
        {...props}
        isDismissable
        onOpenChange={action('open change')}
      >
        <ActionButton
          onPressStart={action('onPressStart')}
          onPress={action('onPress')}
          onPressEnd={action('onPressEnd')}
        >
          Open dialog
        </ActionButton>
        <Dialog>
          <Heading>Dialog title</Heading>
          <Header>
            <Text size="small" color="neutralSecondary">
              Optional header content
            </Text>
          </Header>
          <Content>
            <Text>{getParagraph(3)}</Text>
          </Content>
        </Dialog>
      </DialogTrigger>
    </div>
  );
}

function renderPopover({ width = 'auto', ...props }, withMargin = true) {
  return (
    <div
      style={{
        display: 'flex',
        width,
        margin: withMargin ? '100px 0' : undefined,
      }}
    >
      <DialogTrigger
        type={props.type ?? 'popover'}
        {...props}
        onOpenChange={action('open change')}
      >
        <ActionButton>Open dialog</ActionButton>
        <Dialog>
          <Heading>Dialog title</Heading>
          <Header>
            <Text size="small" color="neutralSecondary">
              Optional header content
            </Text>
          </Header>
          <Content>
            <Text>{getParagraph()}</Text>
          </Content>
        </Dialog>
      </DialogTrigger>
    </div>
  );
}

let TriggerWithRef = (props: Partial<DialogTriggerProps>) => {
  let ref = useRef<HTMLSpanElement>(null);
  return (
    <div style={{ display: 'flex' }}>
      <DialogTrigger
        {...props}
        targetRef={ref}
        onOpenChange={action('open change')}
      >
        <ActionButton>Open dialog</ActionButton>
        <Dialog>
          <Heading>Dialog title</Heading>
          <Header>
            <Text size="small" color="neutralSecondary">
              Optional header content
            </Text>
          </Header>
          <Content>
            <Text>{getParagraph(3)}</Text>
          </Content>
        </Dialog>
      </DialogTrigger>
      <span ref={ref} style={{ marginInlineStart: '200px' }}>
        Popover appears over here
      </span>
    </div>
  );
};

function renderAlert({ width = 'auto', ...props }) {
  return (
    <div style={{ display: 'flex', width, margin: '100px 0' }}>
      <DialogTrigger {...props} onOpenChange={action('open change')}>
        <ActionButton>Open dialog</ActionButton>
        {close => (
          <AlertDialog
            title="Alert! Danger!"
            tone="critical"
            primaryActionLabel="Destroy"
            cancelLabel="Cancel"
            onCancel={chain(close, action('cancel'))}
            onPrimaryAction={chain(close, action('primary'))}
          >
            {getParagraph()}
          </AlertDialog>
        )}
      </DialogTrigger>
    </div>
  );
}
