import { StoryObj } from '@keystar/ui-storybook';
import { ContextualHelp } from '@keystar/ui/contextual-help';
import { Content } from '@keystar/ui/slots';
import { Heading, Text } from '@keystar/ui/typography';

import { Field } from '../index';

type FieldStory = StoryObj<typeof Field>;

export default {
  title: 'Components/Field',
  component: Field as any,
  args: {
    children: (props: any) => <input {...props} />,
    label: 'Label text',
  },
  argTypes: {
    children: { table: { disable: true } },
    contextualHelp: { table: { disable: true } },
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    errorMessage: {
      control: 'text',
    },
    isDisabled: {
      control: 'boolean',
      defaultValue: false,
    },
    isRequired: {
      control: 'boolean',
      defaultValue: true,
    },
    width: {
      control: 'radio',
      defaultValue: undefined,
      options: ['100px', 'size.container.xsmall', undefined],
    },
  },
};

export const Default: FieldStory = {};

export const Description: FieldStory = {
  args: {
    description:
      'Description text provides information to assist the user in completing a field.',
  },
  name: 'description',
};

export const ErrorMessage: FieldStory = {
  args: {
    isRequired: true,
    errorMessage:
      'Error messages inform the user when the input does not meet validation criteria.',
  },
  name: 'errorMessage',
};

export const WithContextualHelp: FieldStory = {
  args: {
    contextualHelp: (
      <ContextualHelp>
        <Heading>Help title</Heading>
        <Content>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit
            amet tristique risus. In sit amet suscipit lorem.
          </Text>
        </Content>
      </ContextualHelp>
    ),
  },
  name: 'contextualHelp',
};

export const AriaLabel: FieldStory = {
  args: {
    label: undefined,
    'aria-label': 'Hidden label',
  },
  argTypes: {
    label: {
      control: { disable: true },
    },
  },
  name: 'aria-label',
};

export const AriaDescribedBy = {
  args: {
    customDescription: 'Custom description text.',
    label: 'Aria described-by example',
    'aria-describedby': 'custom-description',
  },
  argTypes: {
    customDescription: {
      control: 'text',
    },
    'aria-describedby': { control: { disable: true } },
  },
  name: 'aria-describedby',
  decorators: [
    // @ts-ignore
    (Story, Context) => (
      <>
        <Story />
        <p id={Context.args['aria-describedby']}>
          {Context.args.customDescription}
        </p>
      </>
    ),
  ],
};
