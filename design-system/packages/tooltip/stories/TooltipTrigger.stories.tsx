import { action, ArgTypes, storiesOf } from '@voussoir/storybook';

import { Button, ActionButton } from '@voussoir/button';
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

export default {
  title: 'Components/TooltipTrigger',
};

export const Default = renderTooltip();

Default.story = {
  name: 'default',
  parameters: { argTypes },
};

export const IsOpenControlled = renderTooltip({ isOpen: true });

IsOpenControlled.story = {
  name: 'isOpen (controlled)',
  parameters: { argTypes },
};

export const DefaultOpenUncontrolled = renderTooltip({ defaultOpen: true });

DefaultOpenUncontrolled.story = {
  name: 'defaultOpen (uncontrolled)',

  parameters: {
    argTypes,
  },
};

export const TriggerDisabled = () => (
  <TooltipTrigger>
    <ActionButton isDisabled>Trigger</ActionButton>
    <Tooltip>Tooltip content</Tooltip>
  </TooltipTrigger>
);

TriggerDisabled.story = {
  name: 'trigger disabled',
};

export const TooltipDisabled = renderTooltip({ isDisabled: true });

TooltipDisabled.story = {
  name: 'tooltip disabled',
  parameters: { argTypes },
};

export const AnchorTriggers = () => (
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
);

AnchorTriggers.story = {
  name: 'anchor triggers',
};

export const Multiple = () => (
  <Flex gap="regular">
    {['one', 'two', 'three'].map(n => (
      <TooltipTrigger key={n}>
        <ActionButton>{n}</ActionButton>
        <Tooltip>Tooltip content</Tooltip>
      </TooltipTrigger>
    ))}
  </Flex>
);

Multiple.story = {
  name: 'multiple',
};

export const Collisions = () => (
  <Flex direction="column" gap="large" alignSelf="start">
    <TooltipTrigger placement="start">
      <ActionButton>Flip</ActionButton>
      <Tooltip>Tooltip content</Tooltip>
    </TooltipTrigger>
    <TooltipTrigger>
      <ActionButton>Offset</ActionButton>
      <Tooltip>Tooltip content</Tooltip>
    </TooltipTrigger>
  </Flex>
);

Collisions.story = {
  name: 'collisions',
};

function renderTooltip(props: Partial<TooltipTriggerProps> = {}) {
  return function tooltipWithArgs(args: ArgTypes) {
    return (
      <TooltipTrigger
        onOpenChange={action('onOpenChange')}
        {...props}
        {...args}
      >
        <ActionButton>Trigger</ActionButton>
        <Tooltip>Tooltip content</Tooltip>
      </TooltipTrigger>
    );
  };
}
