import { action, ArgTypes, Meta } from '@keystar/ui-storybook';

import { Button, ActionButton } from '@keystar/ui/button';
import { Flex } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { Text } from '@keystar/ui/typography';

import { Tooltip, TooltipTrigger, TooltipTriggerProps } from '..';
import { MOUSE_REST_TIMEOUT } from '../TooltipTrigger';

const meta: Meta = {
  title: 'Components/Tooltip/TooltipTrigger',
  // component: TooltipTrigger,
  parameters: {
    controls: { exclude: ['onOpenChange'] },
  },
  args: {
    placement: 'top',
    delay: MOUSE_REST_TIMEOUT,
    shouldFlip: true,
    offset: 0,
    crossOffset: 0,
    containerPadding: 0,
    onOpenChange: action('onOpenChange'),
  },

  argTypes: {
    placement: {
      control: 'select',
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
      control: { type: 'number', min: 0, max: 5000, step: 100 },
    },
    offset: {
      control: { type: 'number', min: -500, max: 500, step: 10 },
    },
    crossOffset: {
      control: { type: 'number', min: -500, max: 500, step: 10 },
    },
    containerPadding: {
      control: { type: 'number', min: -500, max: 500, step: 10 },
    },
    trigger: {
      control: 'radio',
      description:
        'By default, opens for both focus and hover. Can be made to open only for focus.',
      options: [undefined, 'focus'],
    },
  },
};

export default meta;

export const Default = renderTooltip();

export const IsOpenControlled = renderTooltip({ isOpen: true });

export const DefaultOpenUncontrolled = renderTooltip({ defaultOpen: true });

export const TriggerDisabled = () => (
  <TooltipTrigger>
    <ActionButton isDisabled>Trigger</ActionButton>
    <Tooltip>Tooltip content</Tooltip>
  </TooltipTrigger>
);

export const TooltipDisabled = renderTooltip({ isDisabled: true });

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
