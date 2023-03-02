import { SlugFormField } from '../api';
import slugify from '@sindresorhus/slugify';
import { ActionButton } from '@voussoir/button';
import { Flex, Box } from '@voussoir/layout';
import { TextField } from '@voussoir/text-field';
import { useState, useMemo, useContext } from 'react';
import { useSlugsInCollection } from '../../../app/useSlugsInCollection';
import {
  validateText,
  isValidSlug,
  PathContext,
  SlugFieldContext,
} from './text';

export function slug(args: {
  name: {
    label: string;
    defaultValue?: string;
    description?: string;
    validation?: {
      length?: {
        min?: number;
        max?: number;
      };
    };
  };
  slug?: {
    label?: string;
    generate?: (name: string) => string;
    description?: string;
    validation?: {
      length?: {
        min?: number;
        max?: number;
      };
    };
  };
}): SlugFormField<{ name: string; slug: string }, undefined, string> {
  const naiveGenerateSlug: (name: string) => string =
    args.slug?.generate || slugify;
  const defaultValue = {
    name: args.name.defaultValue ?? '',
    slug: naiveGenerateSlug(args.name.defaultValue ?? ''),
  };
  function SlugFieldInner(props: {
    value: { name: string; slug: string };
    onChange(value: { name: string; slug: string }): void;
    autoFocus: boolean;
    forceValidation: boolean;
    slugs: Set<string>;
  }) {
    const [blurredName, setBlurredName] = useState(false);
    const [blurredSlug, setBlurredSlug] = useState(false);

    const [shouldGenerateSlug, setShouldGenerateSlug] = useState(
      props.value === defaultValue
    );
    const generateSlug = (name: string) => {
      const generated = naiveGenerateSlug(name);
      if (props.slugs.has(generated)) {
        let i = 1;
        while (props.slugs.has(`${generated}-${i}`)) {
          i++;
        }
        return `${generated}-${i}`;
      }
      return generated;
    };

    const slugErrorMessage =
      props.forceValidation || blurredSlug
        ? validateText(
            props.value.slug,
            args.slug?.validation?.length?.min ?? 1,
            args.slug?.validation?.length?.max ?? Infinity,
            args.slug?.label ?? 'Slug',
            props.slugs
          )
        : undefined;

    return (
      <Flex gap="xlarge" direction="column">
        <TextField
          label={args.name.label}
          description={args.name.description}
          autoFocus={props.autoFocus}
          value={props.value.name}
          onChange={name => {
            props.onChange({
              name,
              slug: shouldGenerateSlug ? generateSlug(name) : props.value.slug,
            });
          }}
          onBlur={() => setBlurredName(true)}
          errorMessage={
            props.forceValidation || blurredName
              ? validateText(
                  props.value.name,
                  args.name.validation?.length?.min ?? 0,
                  args.name.validation?.length?.max ?? Infinity,
                  args.name.label
                )
              : undefined
          }
        />
        <Flex gap="small" alignItems="end">
          <TextField
            flex={1}
            label={args.slug?.label ?? 'Slug'}
            description={args.slug?.description}
            value={props.value.slug}
            onChange={slug => {
              setShouldGenerateSlug(false);
              props.onChange({ name: props.value.name, slug });
            }}
            onBlur={() => setBlurredSlug(true)}
            errorMessage={slugErrorMessage}
          />
          <Flex gap="regular" direction="column">
            <ActionButton
              onPress={() => {
                props.onChange({
                  name: props.value.name,
                  slug: generateSlug(props.value.name),
                });
              }}
            >
              Regenerate
            </ActionButton>
            {/* display shim to offset the error message */}
            {slugErrorMessage !== undefined && <Box height="xsmall" />}
          </Flex>
        </Flex>
      </Flex>
    );
  }
  function SlugFieldAsSlugField(props: {
    value: { name: string; slug: string };
    onChange(value: { name: string; slug: string }): void;
    autoFocus: boolean;
    forceValidation: boolean;
    collection: string;
    currentSlug: string | undefined;
  }) {
    const items = useSlugsInCollection(props.collection);
    const slugs = useMemo(() => {
      const otherSlugs = new Set(items);
      if (props.currentSlug !== undefined) {
        otherSlugs.delete(props.currentSlug);
      }
      return otherSlugs;
    }, [items, props.currentSlug]);
    return <SlugFieldInner {...props} slugs={slugs} />;
  }
  const emptySet = new Set<string>();
  return {
    kind: 'form',
    Input(props) {
      const slugContext = useContext(SlugFieldContext);
      const path = useContext(PathContext);
      if (path.length === 1 && path[0] === slugContext?.slugField) {
        return (
          <SlugFieldAsSlugField
            {...props}
            collection={slugContext.collection}
            currentSlug={slugContext.currentSlug}
          />
        );
      }
      return <SlugFieldInner {...props} slugs={emptySet} />;
    },
    options: undefined,
    defaultValue,
    validate(value, slugInfo) {
      const slugs = new Set(slugInfo?.slugs);
      if (slugInfo?.currentSlug !== undefined) {
        slugs.delete(slugInfo.currentSlug);
      }
      return (
        typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        'slug' in value &&
        Object.keys(value).length === 2 &&
        typeof value.name === 'string' &&
        value.name.length >= (args.name.validation?.length?.min ?? 0) &&
        value.name.length <= (args.name.validation?.length?.max ?? Infinity) &&
        typeof value.slug === 'string' &&
        value.slug.length >= (args.slug?.validation?.length?.min ?? 1) &&
        value.slug.length <= (args.slug?.validation?.length?.max ?? Infinity) &&
        isValidSlug(value.slug, slugs)
      );
    },
    slug: {
      parse(data) {
        if (typeof data.value !== 'string') {
          throw new Error('Invalid data');
        }
        return {
          name: data.value,
          slug: data.slug,
        };
      },
      serialize(value) {
        return { slug: value.slug, value: value.name };
      },
    },
  };
}
