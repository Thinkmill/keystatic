import {
  config,
  collection,
  singleton,
  fields,
  component,
  NotEditable,
} from '@keystatic/core';
import { PropsWithChildren } from 'react';

import { ActionGroup, Item } from '@voussoir/action-group';
import { ActionButton } from '@voussoir/button';
import { alertOctagonIcon } from '@voussoir/icon/icons/alertOctagonIcon';
import { alertTriangleIcon } from '@voussoir/icon/icons/alertTriangleIcon';
import { checkCircle2Icon } from '@voussoir/icon/icons/checkCircle2Icon';
import { infoIcon } from '@voussoir/icon/icons/infoIcon';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Icon } from '@voussoir/icon';
import { Divider, Flex } from '@voussoir/layout';
import { css, tokenSchema } from '@voussoir/style';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { Text } from '@voussoir/typography';

export default config({
  storage: {
    kind: 'github',
    repo: { owner: 'Thinkmill', name: 'keystatic-test-repo' },
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'slug',
      schema: {
        title: fields.text({ label: 'Title' }),
        slug: fields.text({
          label: 'Slug',
          validation: { length: { min: 4 } },
        }),
        publishDate: fields.date({ label: 'Publish Date' }),
        heroImage: fields.image({ label: 'Hero Image' }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images/posts',
            publicPath: '/images/posts/',
          },
          componentBlocks: {
            blockChild: component({
              label: 'Block Child',
              preview: props => <div>{props.fields.child.element}</div>,
              schema: {
                child: fields.child({
                  kind: 'block',
                  placeholder: 'Content...',
                }),
              },
            }),
            inlineChild: component({
              label: 'Inline Child',
              preview: props => (
                <div>
                  <div>{props.fields.child.element}</div>{' '}
                  <div>{props.fields.child2.element}</div>
                </div>
              ),
              schema: {
                child: fields.child({
                  kind: 'inline',
                  placeholder: 'Content...',
                }),
                child2: fields.child({
                  kind: 'inline',
                  placeholder: 'Content...',
                }),
              },
            }),
            something: component({
              label: 'Some Component',
              preview: () => null,
              schema: {},
            }),
            notice: component({
              preview: function (props) {
                return (
                  <Note tone={props.fields.tone.value}>
                    {props.fields.content.element}
                  </Note>
                );
              },
              label: 'Note',
              chromeless: true,
              schema: {
                tone: fields.select({
                  label: 'Tone',
                  options: [
                    { value: 'info', label: 'Info' },
                    { value: 'caution', label: 'Caution' },
                    { value: 'positive', label: 'Positive' },
                    { value: 'critical', label: 'Critical' },
                  ] as const,
                  defaultValue: 'info',
                }),
                content: fields.child({
                  kind: 'block',
                  placeholder: '',
                  formatting: 'inherit',
                  dividers: 'inherit',
                  links: 'inherit',
                }),
              },
              toolbar({ props, onRemove }) {
                return (
                  <Flex gap="regular" padding="regular">
                    <ActionGroup
                      selectionMode="single"
                      prominence="low"
                      density="compact"
                      buttonLabelBehavior="hide"
                      onAction={key => {
                        props.fields.tone.onChange(key as any);
                      }}
                      selectedKeys={[props.fields.tone.value]}
                      items={props.fields.tone.options}
                    >
                      {item => (
                        <Item key={item.value} textValue={item.label}>
                          <Icon src={toneToIcon[item.value]} />
                          <Text>{item.label}</Text>
                        </Item>
                      )}
                    </ActionGroup>
                    <Divider orientation="vertical" />
                    <TooltipTrigger>
                      <ActionButton
                        prominence="low"
                        onPress={() => {
                          onRemove();
                        }}
                      >
                        <Icon src={trash2Icon} />
                      </ActionButton>
                      <Tooltip tone="critical">
                        <Text>Remove</Text>
                      </Tooltip>
                    </TooltipTrigger>
                  </Flex>
                );
              },
            }),
            'related-links': component({
              label: 'Related Links',
              preview: props => (
                <div>
                  {props.fields.links.elements.map(element => {
                    return (
                      <div key={element.key}>
                        <NotEditable>
                          <h1>{element.fields.heading.value}</h1>
                        </NotEditable>
                        {element.fields.content.element}
                      </div>
                    );
                  })}
                </div>
              ),
              schema: {
                links: fields.array(
                  fields.object({
                    heading: fields.text({ label: 'Heading' }),
                    content: fields.child({
                      kind: 'inline',
                      placeholder: 'Content...',
                    }),
                    href: fields.text({ label: 'Link' }),
                  }),
                  {
                    asChildTag: 'related-link',
                  }
                ),
              },
            }),
          },
        }),
        authors: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            bio: fields.document({
              label: 'Bio',
              formatting: true,
              dividers: true,
              links: true,
            }),
          }),
          { label: 'Authors', itemLabel: props => props.fields.name.value }
        ),
      },
    }),
    people: collection({
      label: 'People',
      path: 'some/directory/people/*/',
      slugField: 'username',
      schema: {
        name: fields.text({ label: 'Name' }),
        username: fields.text({
          label: 'Username',
          validation: { length: { min: 4 } },
        }),
        favouritePost: fields.relationship({
          label: 'Favourite Post',
          collection: 'posts',
          validation: { isRequired: true },
        }),
      },
    }),
    packages: collection({
      label: 'Packages',
      path: 'packages/*/somewhere/else/',
      slugField: 'name',
      format: 'json',
      schema: {
        name: fields.text({ label: 'Name' }),
        someFilepath: fields.pathReference({ label: 'Some Filepath' }),
        someFilepathInPosts: fields.pathReference({
          label: 'Some Filepath in posts',
          pattern: 'posts/**',
          validation: { isRequired: true },
        }),
      },
    }),
    singlefileposts: collection({
      label: 'Single File Posts',
      path: 'single-file-posts/*/something',
      slugField: 'title',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
        }),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: 'Settings',
      schema: {
        something: fields.checkbox({ label: 'Something' }),
        logo: fields.image({ label: 'Logo' }),
      },
    }),
  },
});

// Styled components
// ------------------------------

const toneToIcon = {
  caution: alertTriangleIcon,
  critical: alertOctagonIcon,
  info: infoIcon,
  positive: checkCircle2Icon,
};

const toneToColor = {
  caution: 'caution',
  critical: 'critical',
  info: 'accent',
  positive: 'positive',
} as const;

function Note({
  children,
  tone = 'info',
  ...props
}: PropsWithChildren<{
  tone?: 'info' | 'caution' | 'critical' | 'positive';
}>) {
  let icon = toneToIcon[tone];
  let color = toneToColor[tone];
  return (
    <div
      {...props}
      className={css({
        borderRadius: tokenSchema.size.radius.regular,
        background: 'var(--bg)',
        color: 'var(--fg)',
        display: 'flex',
        gap: '1em',
        padding: '1em',

        svg: {
          fill: 'none',
          stroke: 'currentColor',
          height: 20,
          width: 20,
        },

        '& [data-slate-node="element"]': {
          '&:first-child': {
            marginTop: 0,
          },
          '&:last-child': {
            marginBottom: 0,
          },
        },
      })}
      style={{
        // @ts-ignore
        '--bg': tokenSchema.color.background[color],
        '--fg': tokenSchema.color.foreground[color],
      }}
    >
      {icon}
      <div>{children}</div>
    </div>
  );
}
