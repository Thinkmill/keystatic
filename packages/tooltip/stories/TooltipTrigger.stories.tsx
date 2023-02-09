import { action } from '@storybook/addon-actions';
import { ArgTypes, storiesOf } from '@storybook/react';

import { Button } from '@voussoir/button';
import { Flex } from '@voussoir/layout';
import { TextLink } from '@voussoir/link';
import { Text } from '@voussoir/typography';

import { Tooltip, TooltipTrigger, TooltipTriggerProps } from '../src';
import { MOUSE_REST_TIMEOUT } from '../src/TooltipTrigger';

const argTypes = {
  placement: {
    control: 'select',
    defaultValue: 'top',
    options: [
      'top',
      'top left',
      'top right',
      'top start',
      'top end',
      'bottom',
      'bottom left',
      'bottom right',
      'bottom start',
      'bottom end',
      'left',
      'left top',
      'left bottom',
      'right',
      'right top',
      'right bottom',
      'start',
      'start top',
      'start bottom',
      'end',
      'end top',
      'end bottom',
    ],
  },
  delay: {
    control: {
      type: 'number',
      defaultValue: MOUSE_REST_TIMEOUT,
      min: 0,
      max: 5000,
      step: 100,
    },
  },
  offset: {
    control: {
      type: 'number',
      defaultValue: 0,
      min: -500,
      max: 500,
    },
  },
  crossOffset: {
    control: {
      type: 'number',
      defaultValue: 0,
      min: -500,
      max: 500,
    },
  },
  containerPadding: {
    control: {
      type: 'number',
      defaultValue: 0,
      min: -500,
      max: 500,
    },
  },
  shouldFlip: {
    control: 'boolean',
    defaultValue: true,
  },
  trigger: {
    control: 'radio',
    defaultValue: undefined,
    options: [undefined, 'focus'],
  },
};

storiesOf('Components/TooltipTrigger', module)
  .add('default', renderTooltip(), { argTypes })
  .add('isOpen (controlled)', renderTooltip({ isOpen: true }), { argTypes })
  .add('defaultOpen (uncontrolled)', renderTooltip({ defaultOpen: true }), {
    argTypes,
  })
  .add('trigger disabled', () => (
    <TooltipTrigger>
      <Button isDisabled>Trigger</Button>
      <Tooltip>Tooltip content</Tooltip>
    </TooltipTrigger>
  ))
  .add('tooltip disabled', renderTooltip({ isDisabled: true }), { argTypes })
  .add('anchor triggers', () => (
    <Flex direction="column" gap="large" alignItems="start">
      <TooltipTrigger>
        <Button href="https://example.com">Anchor w/role=button</Button>
        <Tooltip>Tooltip content</Tooltip>
      </TooltipTrigger>
      <Text>
        Content that includes a{' '}
        <TooltipTrigger>
          <TextLink href="https://example.com">text link</TextLink>
          <Tooltip>Tooltip content</Tooltip>
        </TooltipTrigger>{' '}
        wrapped in a tooltip trigger.
      </Text>
    </Flex>
  ))
  .add('multiple', () => (
    <Flex gap="regular">
      {['one', 'two', 'three'].map(n => (
        <TooltipTrigger key={n}>
          <Button>{n}</Button>
          <Tooltip>Tooltip content</Tooltip>
        </TooltipTrigger>
      ))}
    </Flex>
  ))
  .add('collisions', () => (
    <Flex direction="column" gap="large" alignSelf="start">
      <TooltipTrigger placement="start">
        <Button>Flip</Button>
        <Tooltip>Tooltip content</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <Button>Offset</Button>
        <Tooltip>Tooltip content</Tooltip>
      </TooltipTrigger>
    </Flex>
  ));

function renderTooltip(props: Partial<TooltipTriggerProps> = {}) {
  return function tooltipWithArgs(args: ArgTypes) {
    return (
      <TooltipTrigger
        onOpenChange={action('onOpenChange')}
        {...props}
        {...args}
      >
        <Button>Trigger</Button>
        <Tooltip>Tooltip content</Tooltip>
      </TooltipTrigger>
    );
  };
}
