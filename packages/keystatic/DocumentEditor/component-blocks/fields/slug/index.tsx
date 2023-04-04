import { SlugFormField } from '../../api';
import slugify from '@sindresorhus/slugify';
import { isValidSlug } from '../text';
import { SlugFieldInput } from './ui';

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
}): SlugFormField<{ name: string; slug: string }, string> {
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
      return (
        <SlugFieldInput
          args={args}
          naiveGenerateSlug={naiveGenerateSlug}
          defaultValue={defaultValue}
          {...props}
        />
      );
    },
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
