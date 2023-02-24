import { useState, useEffect } from 'react';

import { ActionGroup, Item } from '@voussoir/action-group';
import { ActionButton } from '@voussoir/button';
import { alertTriangleIcon } from '@voussoir/icon/icons/alertTriangleIcon';
import { checkCircle2Icon } from '@voussoir/icon/icons/checkCircle2Icon';
import { infoIcon } from '@voussoir/icon/icons/infoIcon';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Icon } from '@voussoir/icon';
import { Notice } from '@voussoir/notice';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { Text } from '@voussoir/typography';
import { Flex } from '@voussoir/layout';

import {
  config,
  collection,
  singleton,
  fields,
  component,
  NotEditable,
} from '@keystatic/core';

function useObjectURL(data: Uint8Array | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (data) {
      const url = URL.createObjectURL(new Blob([data]));
      setUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setUrl(null);
    }
  }, [data]);
  return url;
}

const toneToIcon = {
  caution: alertTriangleIcon,
  critical: alertTriangleIcon,
  neutral: infoIcon,
  positive: checkCircle2Icon,
};

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
            image: component({
              label: 'Image',
              preview: function Preview(props) {
                const url = useObjectURL(
                  props.fields.image.value.kind === 'uploaded'
                    ? props.fields.image.value.data
                    : null
                );
                return url ? (
                  <NotEditable>
                    <img
                      src={url}
                      alt={props.fields.alt.value}
                      style={{
                        display: 'block',
                        height: 140,
                        maxWidth: '100%',
                      }}
                    />
                  </NotEditable>
                ) : null;
              },
              schema: {
                image: fields.image({ label: 'Image' }),
                alt: fields.text({ label: 'Alt text', multiline: true }),
              },
            }),
            notice: component({
              preview: function (props) {
                return (
                  <Notice tone={props.fields.tone.value}>
                    {props.fields.content.element}
                  </Notice>
                );
              },
              label: 'Notice',
              chromeless: true,
              schema: {
                tone: fields.select({
                  label: 'Tone',
                  options: [
                    { value: 'neutral', label: 'Neutral' },
                    { value: 'caution', label: 'Caution' },
                    { value: 'critical', label: 'Critical' },
                    { value: 'positive', label: 'Positive' },
                  ] as const,
                  defaultValue: 'neutral',
                }),
                content: fields.child({
                  kind: 'block',
                  placeholder: '',
                  formatting: 'inherit',
                  dividers: 'inherit',
                  links: 'inherit',
                  relationships: 'inherit',
                }),
              },
              toolbar({ props, onRemove }) {
                return (
                  <Flex margin="medium">
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
      directory: 'some/directory/people',
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
        }),
      },
    }),
    packages: collection({
      label: 'Packages',
      directorySuffix: 'somewhere/else',
      slugField: 'name',
      format: 'json',
      schema: {
        name: fields.text({ label: 'Name' }),
        someFilepath: fields.pathReference({ label: 'Some Filepath' }),
        someFilepathInPosts: fields.pathReference({
          label: 'Some Filepath in posts',
          pattern: 'posts/**',
        }),
      },
    }),
    singlefileposts: collection({
      label: 'Single File Posts',
      directory: 'single-file-posts',
      slugField: 'slug',
      format: { contentField: 'content', frontmatter: 'yaml' },
      schema: {
        title: fields.text({ label: 'Title' }),
        slug: fields.text({ label: 'Slug' }),
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
