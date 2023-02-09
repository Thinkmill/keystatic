import { ComponentMeta, ComponentStoryObj } from '@voussoir/storybook';

import { Field } from '../src';

type FieldStory = ComponentStoryObj<typeof Field>;

const argTypes = {
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
};

export default {
  title: 'Components/Field',
  component: Field,
  args: {
    children: (props: any) => <input {...props} />,
  },
  argTypes: argTypes,
} as ComponentMeta<typeof Field>;

export let Default: FieldStory = {
  args: {
    label: 'Label text',
    description:
      'Description text provides information to assist the user in completing a field.',
    errorMessage:
      'Error messages inform the user when the input does not meet validation criteria.',
  },
};

export let AriaLabel: FieldStory = {
  args: {
    label: undefined,
    'aria-label': 'Hidden label',
  },
  argTypes: {
    label: {
      control: { disable: true },
    },
  },
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
