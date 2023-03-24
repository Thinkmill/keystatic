import { SlugFormField } from '../api';
import slugify from '@sindresorhus/slugify';
import { ActionButton } from '@voussoir/button';
import { Flex, Box } from '@voussoir/layout';
import { TextField } from '@voussoir/text-field';
import { useState, useContext } from 'react';
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

  const emptySet = new Set<string>();
  return {
    kind: 'form',
    Input(props) {
      const slugContext = useContext(SlugFieldContext);
      const path = useContext(PathContext);
      const slugInfo =
        path.length === 1 && path[0] === slugContext?.field
          ? slugContext
          : { slugs: emptySet, glob: '*' as const };

      const [blurredName, setBlurredName] = useState(false);
      const [blurredSlug, setBlurredSlug] = useState(false);

      const [shouldGenerateSlug, setShouldGenerateSlug] = useState(
        props.value === defaultValue
      );
      const generateSlug = (name: string) => {
        const generated = naiveGenerateSlug(name);
        if (slugInfo.slugs.has(generated)) {
          let i = 1;
          while (slugInfo.slugs.has(`${generated}-${i}`)) {
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
              slugInfo
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
                slug: shouldGenerateSlug
                  ? generateSlug(name)
                  : props.value.slug,
              });
            }}
            onBlur={() => setBlurredName(true)}
            errorMessage={
              props.forceValidation || blurredName
                ? validateText(
                    props.value.name,
                    args.name.validation?.length?.min ?? 0,
                    args.name.validation?.length?.max ?? Infinity,
                    args.name.label,
                    undefined
                  )
                : undefined
            }
          />
          <Flex gap="regular" alignItems="end">
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
    },
    options: undefined,
    defaultValue,
    validate(value, slugInfo) {
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
        isValidSlug(
          value.slug,
          slugInfo ? slugInfo : { slugs: emptySet, glob: '*' }
        )
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
