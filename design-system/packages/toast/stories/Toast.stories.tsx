import { useLandmark } from '@react-aria/landmark';
import React, { useRef, useState } from 'react';

import { ActionButton } from '@keystar-ui/button';
import { Dialog, DialogTrigger } from '@keystar-ui/dialog';
import { Icon } from '@keystar-ui/icon';
import { checkCircle2Icon } from '@keystar-ui/icon/icons/checkCircle2Icon';
import { infoIcon } from '@keystar-ui/icon/icons/infoIcon';
import { alertTriangleIcon } from '@keystar-ui/icon/icons/alertTriangleIcon';
import { Box, Flex } from '@keystar-ui/layout';
import { Content } from '@keystar-ui/slots';
import { ArgTypes, action, storiesOf } from '@keystar-ui/storybook';
import { Heading, Text } from '@keystar-ui/typography';

import { Toaster, ToastOptions, toastQueue } from '../src';

storiesOf('Components/Toast', module)
  .addParameters({
    args: {
      shouldCloseOnAction: false,
      timeout: null,
    },
    argTypes: {
      timeout: {
        control: {
          type: 'radio',
          options: [null, 5000],
        },
      },
    },
  })
  .addDecorator(story => (
    <>
      <Toaster />
      <MainLandmark>{story()}</MainLandmark>
    </>
  ))
  .add('Default', (args: ArgTypes) => <Example {...args} />)
  .add('Actions', (args: ArgTypes) => (
    <Example {...args} actionLabel="Action" onAction={action('onAction')} />
  ))
  .add('Within dialog', (args: ArgTypes) => (
    <DialogTrigger isDismissable>
      <ActionButton>Open dialog</ActionButton>
      <Dialog>
        <Heading>Toasty</Heading>
        <Content>
          <Example {...args} />
        </Content>
      </Dialog>
    </DialogTrigger>
  ))
  .add('Programmatic closing', (args: ArgTypes) => <ToastToggle {...args} />);

function Example(options: ToastOptions) {
  return (
    <Flex gap="regular">
      <ActionButton
        onPress={() =>
          toastQueue.neutral('3 items archived', {
            ...options,
            onClose: action('onClose'),
          })
        }
      >
        <Text>Neutral</Text>
      </ActionButton>
      <ActionButton
        onPress={() =>
          toastQueue.info('A new version is available', {
            ...options,
            onClose: action('onClose'),
          })
        }
      >
        <Icon src={infoIcon} color="accent" />
        <Text>Info</Text>
      </ActionButton>
      <ActionButton
        onPress={() =>
          toastQueue.positive('File uploaded', {
            ...options,
            onClose: action('onClose'),
          })
        }
      >
        <Icon src={checkCircle2Icon} color="positive" />
        <Text>Positive</Text>
      </ActionButton>
      <ActionButton
        onPress={() =>
          toastQueue.critical('Unable to delete entry', {
            ...options,
            onClose: action('onClose'),
          })
        }
      >
        <Icon src={alertTriangleIcon} color="critical" />
        <Text>Critical</Text>
      </ActionButton>
    </Flex>
  );
}

function ToastToggle(options: ToastOptions) {
  let [close, setClose] = useState<(() => void) | null>(null);

  return (
    <ActionButton
      onPress={() => {
        if (!close) {
          let close = toastQueue.critical('Unable to delete entry', {
            ...options,
            onClose: () => setClose(null),
          });
          setClose(() => close);
        } else {
          close();
        }
      }}
    >
      {close ? 'Hide' : 'Show'} toast
    </ActionButton>
  );
}

function MainLandmark(props: any) {
  let ref = useRef<HTMLElement>(null);
  // @ts-expect-error dom refs may be null until after the first render. not sure what react-aria expects in these cases.
  let { landmarkProps } = useLandmark({ ...props, role: 'main' }, ref);
  return (
    <Box
      elementType="main"
      aria-label="Danni's unicorn corral"
      ref={ref}
      padding="large"
      backgroundColor="surface"
      {...props}
      {...landmarkProps}
    >
      {props.children}
    </Box>
  );
}
