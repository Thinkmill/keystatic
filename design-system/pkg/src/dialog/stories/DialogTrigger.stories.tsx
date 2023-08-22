import { chain } from '@react-aria/utils';
import { action } from '@keystar/ui-storybook';
import { useRef } from 'react';

import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import { Flex } from '@keystar/ui/layout';
import { Content, Header } from '@keystar/ui/slots';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Heading, Text } from '@keystar/ui/typography';

import { AlertDialog, Dialog, DialogTrigger, DialogTriggerProps } from '..';
import { getParagraph } from './common';

export default {
  title: 'Components/Dialog/DialogTrigger',
};

export const Default = () => render({});

Default.story = {
  name: 'default',
};

export const WithTooltip = () => {
  return (
    <DialogTrigger>
      <TooltipTrigger>
        <ActionButton>Open dialog</ActionButton>
        <Tooltip>Tooltip content</Tooltip>
      </TooltipTrigger>
      <Dialog>
        <Heading>Dialog heading</Heading>
        <Content>
          <Text>Dialog content</Text>
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};

export const TypePopover = () => renderPopover({ type: 'popover' });

TypePopover.story = {
  name: 'type: popover',
};

export const TypeModal = () => render({ type: 'modal' });

TypeModal.story = {
  name: 'type: modal',
};

export const TypeModalIsDismissable = () =>
  render({ type: 'modal', isDismissable: true });

TypeModalIsDismissable.story = {
  name: 'type: modal isDismissable',
};

export const TypeFullscreen = () => render({ type: 'fullscreen' });

TypeFullscreen.story = {
  name: 'type: fullscreen',
};

export const TypeTray = () => renderPopover({ type: 'tray' });

TypeTray.story = {
  name: 'type: tray',
};

export const MobileTypeFullscreen = () =>
  render({ type: 'modal', mobileType: 'fullscreen' });

MobileTypeFullscreen.story = {
  name: 'mobileType: fullscreen',
};

export const PopoverWithMobileTypeModal = () =>
  renderPopover({ mobileType: 'modal' });

PopoverWithMobileTypeModal.story = {
  name: 'popover with mobileType: modal',
};

export const PopoverWithMobileTypeTray = () =>
  renderPopover({ mobileType: 'tray' });

PopoverWithMobileTypeTray.story = {
  name: 'popover with mobileType: tray',
};

export const NestedModals = () => (
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
);

NestedModals.story = {
  name: 'nested modals',
};

export const NestedPopovers = () => (
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
);

NestedPopovers.story = {
  name: 'nested popovers',
};

export const PopoverInsideScrollView = () => (
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
);

PopoverInsideScrollView.story = {
  name: 'popover inside scroll view',
};

export const Offset = () => renderPopover({ offset: 50 });

Offset.story = {
  name: 'offset',
};

export const CrossOffset = () => renderPopover({ crossOffset: 50 });

CrossOffset.story = {
  name: 'crossOffset',
};

export const ShouldFlipTrue = () =>
  renderPopover({
    placement: 'start',
    shouldFlip: true,
    width: 'calc(100vh - 100px)',
  });

ShouldFlipTrue.story = {
  name: 'shouldFlip: true',
};

export const ShouldFlipFalse = () =>
  renderPopover({
    placement: 'start',
    shouldFlip: false,
    width: 'calc(100vh - 100px)',
  });

ShouldFlipFalse.story = {
  name: 'shouldFlip: false',
};

export const ShouldFlipTrueWithOffset = () =>
  renderPopover({
    placement: 'start',
    shouldFlip: true,
    offset: 50,
    width: 'calc(100vh - 100px)',
  });

ShouldFlipTrueWithOffset.story = {
  name: 'shouldFlip: true with offset',
};

export const KeyboardDismissDisabledModal = () =>
  render({ type: 'modal', isKeyboardDismissDisabled: true });

KeyboardDismissDisabledModal.story = {
  name: 'keyboard dismiss disabled: modal',
};

export const KeyboardDismissDisabledPopover = () =>
  renderPopover({
    placement: 'bottom',
    isKeyboardDismissDisabled: true,
  });

KeyboardDismissDisabledPopover.story = {
  name: 'keyboard dismiss disabled: popover',
};

export const KeyboardDismissDisabledTray = () =>
  renderPopover({ type: 'tray', isKeyboardDismissDisabled: true });

KeyboardDismissDisabledTray.story = {
  name: 'keyboard dismiss disabled: tray',
};

export const ContainerPadding = () =>
  renderPopover({
    placement: 'bottom',
    width: 'calc(100vh - 100px)',
    containerPadding: 200,
  });

ContainerPadding.story = {
  name: 'containerPadding',
};

export const CloseFunctionWithButtonPopover = () => (
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
);

CloseFunctionWithButtonPopover.story = {
  name: 'close function with button: popover',
};

export const TargetRef = () => <TriggerWithRef type="popover" />;

TargetRef.story = {
  name: 'targetRef',
};

export const _AlertDialog = () => renderAlert({});

_AlertDialog.story = {
  name: 'alert dialog',
};

export const CrossoffsetExamples = () => (
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
);

CrossoffsetExamples.story = {
  name: 'crossoffset examples',
};

export const TriggerVisibleThroughUnderlay = () => renderTriggerNotCentered({});

TriggerVisibleThroughUnderlay.story = {
  name: 'trigger visible through underlay',
};

export const _2Popovers = () => (
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
);

_2Popovers.story = {
  name: '2 popovers',
};

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
