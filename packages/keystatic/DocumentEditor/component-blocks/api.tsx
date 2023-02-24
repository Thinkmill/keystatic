import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import Markdoc from '@markdoc/markdoc';

import { Checkbox } from '@voussoir/checkbox';
import { FieldLabel, FieldPrimitive } from '@voussoir/field';
import { Picker, Item } from '@voussoir/picker';
import { css, tokenSchema } from '@voussoir/style';
import { TextArea, TextField } from '@voussoir/text-field';
import { Editor } from 'slate';
import { filter } from 'minimatch';

import { fromMarkdoc } from '../../markdoc/from-markdoc';
import { toMarkdocDocument } from '../../markdoc/to-markdoc';
import {
  createDocumentEditor,
  DocumentEditor,
  useIsInDocumentEditor,
} from '..';
import { DocumentFeatures } from '../document-features';
import { isValidURL } from '../isValidURL';
import { ActionButton, ButtonGroup } from '@voussoir/button';
import { Box, BoxProps, Flex } from '@voussoir/layout';
import {
  CollectedFile,
  collectFiles,
  deserializeFiles,
} from './document-field';
import { ElementFromValidation } from '../../structure-validation';
import { Combobox } from '@voussoir/combobox';
import { useTree } from '../../app/shell/data';
import { ReadonlyPropPath } from './utils';
import { useSlugsInCollection } from '../../app/useSlugsInCollection';
import slugify from '@sindresorhus/slugify';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export type FormFieldValue =
  | string
  | number
  | boolean
  | null
  | readonly FormFieldValue[]
  | { [key: string]: FormFieldValue | undefined };

const emptyObject = {};

type FormattingConfig = {
  inlineMarks?:
    | true
    | {
        bold?: true;
        italic?: true;
        underline?: true;
        strikethrough?: true;
        code?: true;
        superscript?: true;
        subscript?: true;
        keyboard?: true;
      };
  listTypes?:
    | true
    | {
        ordered?: true;
        unordered?: true;
      };
  alignment?:
    | true
    | {
        center?: true;
        end?: true;
      };
  headingLevels?: true | readonly (1 | 2 | 3 | 4 | 5 | 6)[];
  blockTypes?:
    | true
    | {
        blockquote?: true;
        code?: true;
      };
  softBreaks?: true;
};

type DocumentFeaturesConfig = {
  formatting?: true | FormattingConfig;
  links?: true;
  dividers?: true;
  layouts?: readonly (readonly [number, ...number[]])[];
};

function normaliseDocumentFeatures(config: DocumentFeaturesConfig) {
  const formatting: FormattingConfig =
    config.formatting === true
      ? {
          alignment: true,
          blockTypes: true,
          headingLevels: true,
          inlineMarks: true,
          listTypes: true,
          softBreaks: true,
        }
      : config.formatting ?? {};
  const documentFeatures: DocumentFeatures = {
    formatting: {
      alignment:
        formatting.alignment === true
          ? {
              center: true,
              end: true,
            }
          : {
              center: !!formatting.alignment?.center,
              end: !!formatting.alignment?.end,
            },
      blockTypes:
        formatting?.blockTypes === true
          ? { blockquote: true, code: true }
          : {
              blockquote: !!formatting.blockTypes?.blockquote,
              code: !!formatting.blockTypes?.code,
            },
      headingLevels:
        formatting?.headingLevels === true
          ? [1, 2, 3, 4, 5, 6]
          : [...new Set(formatting?.headingLevels)].sort(),
      inlineMarks:
        formatting.inlineMarks === true
          ? {
              bold: true,
              code: true,
              italic: true,
              keyboard: true,
              strikethrough: true,
              subscript: true,
              superscript: true,
              underline: true,
            }
          : {
              bold: !!formatting.inlineMarks?.bold,
              code: !!formatting.inlineMarks?.code,
              italic: !!formatting.inlineMarks?.italic,
              strikethrough: !!formatting.inlineMarks?.strikethrough,
              underline: !!formatting.inlineMarks?.underline,
              keyboard: !!formatting.inlineMarks?.keyboard,
              subscript: !!formatting.inlineMarks?.subscript,
              superscript: !!formatting.inlineMarks?.superscript,
            },
      listTypes:
        formatting.listTypes === true
          ? { ordered: true, unordered: true }
          : {
              ordered: !!formatting.listTypes?.ordered,
              unordered: !!formatting.listTypes?.unordered,
            },
      softBreaks: !!formatting.softBreaks,
    },
    links: !!config.links,
    layouts: [
      ...new Set((config.layouts || []).map(x => JSON.stringify(x))),
    ].map(x => JSON.parse(x)),
    dividers: !!config.dividers,
  };
  return documentFeatures;
}

export type BasicFormField<Value, Options> = {
  kind: 'form';
  Input(props: {
    value: Value;
    onChange(value: Value): void;
    autoFocus: boolean;
    /**
     * This will be true when validate has returned false and the user has attempted to close the form
     * or when the form is open and they attempt to save the item
     */
    forceValidation: boolean;
  }): ReactElement | null;
  /**
   * The options are config about the field that are available on the
   * preview props when rendering the toolbar and preview component
   */
  options: Options;
  defaultValue: Value;
  /**
   * validate will be called in two cases:
   * - on the client in the editor when a user is changing the value.
   *   Returning `false` will block closing the form
   *   and saving the item.
   * - on the server when a change is received before allowing it to be saved
   *   if `true` is returned
   * @param value The value of the form field. You should NOT trust
   * this value to be of the correct type because it could come from
   * a potentially malicious client
   */
  validate(value: unknown): boolean;
};

export type FormField<Value, Options> =
  | BasicFormField<Value, Options>
  | FormFieldWithFile<Value, Options, any>
  | SlugFormField<Value, Options, any>;

export type SlugFormField<Value, Options, SerializedValue> = Omit<
  BasicFormField<Value, Options>,
  'validate'
> & {
  slug: {
    serialize(value: Value): { slug: string; value: SerializedValue };
    parse(data: { slug: string; value: unknown }): Value;
  };
  validate(
    value: unknown,
    slugFieldInfo:
      | { slugs: Set<string>; currentSlug: string | undefined }
      | undefined
  ): boolean;
};

export type FormFieldWithFile<Value, Options, DataInReader> =
  | FormFieldWithFileRequiringContentsForReader<Value, Options, DataInReader>
  | FormFieldWithFileNotRequiringContentsForReader<
      Value,
      Options,
      DataInReader
    >;

type FormFieldWithFileRequiringContentsForReader<Value, Options, DataInReader> =
  BasicFormField<Value, Options> & {
    serializeToFile:
      | (BaseSerializeToSingleFile<Value> & {
          reader: {
            requiresContentInReader: true;
            parseToReader(data: {
              content: Uint8Array | undefined;
              value: unknown;
              suggestedFilenamePrefix: string | undefined;
            }): DataInReader;
          };
        })
      | (BaseSerializeToFiles<Value> & {
          reader: {
            requiresContentInReader: true;
            parseToReader(data: {
              value: unknown;
              primary: Uint8Array | undefined;
              other: { [key: string]: Uint8Array };
            }): DataInReader;
          };
        });
  };
type FormFieldWithFileNotRequiringContentsForReader<
  Value,
  Options,
  DataInReader
> = BasicFormField<Value, Options> & {
  serializeToFile:
    | (BaseSerializeToSingleFile<Value> & {
        reader: {
          requiresContentInReader: false;
          parseToReader(data: {
            value: unknown;
            suggestedFilenamePrefix: string | undefined;
          }): DataInReader;
        };
      })
    | (BaseSerializeToFiles<Value> & {
        reader: {
          requiresContentInReader: false;
          parseToReader(data: { value: unknown }): DataInReader;
        };
      });
};

type BaseSerializeToSingleFile<Value> = {
  kind: 'asset';
  filename(
    value: unknown,
    suggestedFilenamePrefix: string | undefined
  ): string | undefined;
  serialize(
    value: Value,
    suggestedFilenamePrefix: string | undefined
  ): {
    value: unknown;
  } & (
    | { content: undefined }
    | {
        content: Uint8Array;
        filename: string;
      }
  );
  parse(data: {
    content: Uint8Array | undefined;
    value: unknown;
    suggestedFilenamePrefix: string | undefined;
  }): Value;
};

type BaseSerializeToFiles<Value> = {
  kind: 'multi';
  primaryExtension: string;
  files(value: unknown): string[];
  serialize(value: Value): Promise<{
    value: unknown;
    primary: Uint8Array | undefined;
    other: { [key: string]: Uint8Array };
  }>;
  parse(data: {
    value: unknown;
    primary: Uint8Array | undefined;
    other: { [key: string]: Uint8Array };
  }): Value;
};

export type DocumentNode = DocumentElement | DocumentText;

export type DocumentElement = {
  children: DocumentNode[];
  [key: string]: unknown;
};

export type DocumentText = {
  text: string;
  [key: string]: unknown;
};

type InlineMarksConfig =
  | 'inherit'
  | {
      bold?: 'inherit';
      code?: 'inherit';
      italic?: 'inherit';
      strikethrough?: 'inherit';
      underline?: 'inherit';
      keyboard?: 'inherit';
      subscript?: 'inherit';
      superscript?: 'inherit';
    };

type BlockFormattingConfig = {
  alignment?: 'inherit';
  blockTypes?: 'inherit';
  headingLevels?: 'inherit' | (1 | 2 | 3 | 4 | 5 | 6)[];
  inlineMarks?: InlineMarksConfig;
  listTypes?: 'inherit';
  softBreaks?: 'inherit';
};

export type ChildField = {
  kind: 'child';
  options:
    | {
        kind: 'block';
        placeholder: string;
        formatting?: BlockFormattingConfig;
        dividers?: 'inherit';
        links?: 'inherit';
        relationships?: 'inherit';
      }
    | {
        kind: 'inline';
        placeholder: string;
        formatting?: {
          inlineMarks?: InlineMarksConfig;
          softBreaks?: 'inherit';
        };
        links?: 'inherit';
        relationships?: 'inherit';
      };
};

export type ArrayField<ElementField extends ComponentSchema> = {
  kind: 'array';
  element: ElementField;
  label: string;
  // this is written with unknown to avoid typescript being annoying about circularity or variance things
  itemLabel?(props: unknown): string;
  asChildTag?: string;
};

export interface ObjectField<
  Fields extends Record<string, ComponentSchema> = Record<
    string,
    ComponentSchema
  >
> {
  kind: 'object';
  fields: Fields;
}

export type ConditionalField<
  DiscriminantField extends BasicFormField<string | boolean, any>,
  ConditionalValues extends {
    [Key in `${DiscriminantField['defaultValue']}`]: ComponentSchema;
  }
> = {
  kind: 'conditional';
  discriminant: DiscriminantField;
  values: ConditionalValues;
};

// this is written like this rather than ArrayField<ComponentSchema> to avoid TypeScript erroring about circularity
type ArrayFieldInComponentSchema = {
  kind: 'array';
  element: ComponentSchema;
  label: string;
  // this is written with unknown to avoid typescript being annoying about circularity or variance things
  itemLabel?(props: unknown): string;
  asChildTag?: string;
};

export type ComponentSchema =
  | ChildField
  | FormField<any, any>
  | ObjectField
  | ConditionalField<
      BasicFormField<any, any>,
      { [key: string]: ComponentSchema }
    >
  | ArrayFieldInComponentSchema;

function validateText(
  val: string,
  min: number,
  max: number,
  fieldLabel: string,
  slugs?: Set<string>
) {
  if (val.length < min) {
    if (min === 1) {
      return `${fieldLabel} must not be empty`;
    } else {
      return `${fieldLabel} must be at least ${min} characters long`;
    }
  }
  if (val.length > max) {
    return `${fieldLabel} must be no longer than ${max} characters`;
  }
  if (slugs) {
    if (val === '..') {
      return `${fieldLabel} must not be ..`;
    }
    if (val === '.') {
      return `${fieldLabel} must not be .`;
    }
    if (/[\\/]/.test(val)) {
      return `${fieldLabel} must not contain slashes`;
    }
    if (slugs.has(val)) {
      return `${fieldLabel} must be unique`;
    }
  }
}

function isValidSlug(val: string, slugs: Set<string>) {
  return val !== '..' && val !== '.' && !/[\\/]/.test(val) && !slugs.has(val);
}

const SlugFieldContext = createContext<
  | { slugField: string; collection: string; currentSlug: string | undefined }
  | undefined
>(undefined);

export const SlugFieldProvider = SlugFieldContext.Provider;

const PathContext = createContext<ReadonlyPropPath>([]);

export const PathContextProvider = PathContext.Provider;

export function AddToPathProvider(props: {
  part: string | number;
  children: ReactNode;
}) {
  const path = useContext(PathContext);
  return (
    <PathContext.Provider
      value={useMemo(() => path.concat(props.part), [path, props.part])}
    >
      {props.children}
    </PathContext.Provider>
  );
}

export const fields = {
  text({
    label,
    defaultValue = '',
    validation: { length: { max = Infinity, min = 0 } = {} } = {},
    description,
    multiline = false,
  }: {
    label: string;
    defaultValue?: string;
    description?: string;
    validation?: {
      length?: {
        min?: number;
        max?: number;
      };
    };
    multiline?: boolean;
  }): SlugFormField<string, undefined, undefined> {
    const TextFieldComponent = multiline ? TextArea : TextField;
    function SlugTextField(props: {
      value: string;
      onChange: (value: string) => void;
      autoFocus?: boolean;
      forceValidation?: boolean;
      collection: string;
      currentSlug: string | undefined;
    }) {
      const [blurred, setBlurred] = useState(false);

      const items = useSlugsInCollection(props.collection);
      const slugs = useMemo(() => {
        const otherSlugs = new Set(items);
        if (props.currentSlug !== undefined) {
          otherSlugs.delete(props.currentSlug);
        }
        return otherSlugs;
      }, [items, props.currentSlug]);

      return (
        <TextFieldComponent
          label={label}
          description={description}
          autoFocus={props.autoFocus}
          value={props.value}
          onChange={props.onChange}
          onBlur={() => setBlurred(true)}
          errorMessage={
            props.forceValidation || blurred
              ? validateText(props.value, Math.max(min, 1), max, label, slugs)
              : undefined
          }
        />
      );
    }
    return {
      kind: 'form',
      Input(props) {
        const [blurred, setBlurred] = useState(false);
        const slugContext = useContext(SlugFieldContext);
        const path = useContext(PathContext);
        if (path.length === 1 && slugContext?.slugField === path[0]) {
          return (
            <SlugTextField
              collection={slugContext.collection}
              currentSlug={slugContext.currentSlug}
              {...props}
            />
          );
        }
        return (
          <TextFieldComponent
            label={label}
            description={description}
            autoFocus={props.autoFocus}
            value={props.value}
            onChange={props.onChange}
            onBlur={() => setBlurred(true)}
            errorMessage={
              props.forceValidation || blurred
                ? validateText(props.value, min, max, label)
                : undefined
            }
          />
        );
      },
      options: undefined,
      defaultValue,
      validate(value, slugInfo) {
        if (
          !(
            typeof value === 'string' &&
            value.length >= Math.max(min, slugInfo ? 1 : 0) &&
            value.length <= max
          )
        ) {
          return false;
        }
        if (slugInfo) {
          const slugs = new Set(slugInfo.slugs);
          if (slugInfo.currentSlug !== undefined) {
            slugs.delete(slugInfo.currentSlug);
          }
          return isValidSlug(value, slugs);
        }
        return true;
      },
      slug: {
        parse(data) {
          return data.slug;
        },
        serialize(value) {
          return { slug: value, value: undefined };
        },
      },
    };
  },
  slug(args: {
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
          value.name.length <=
            (args.name.validation?.length?.max ?? Infinity) &&
          typeof value.slug === 'string' &&
          value.slug.length >= (args.slug?.validation?.length?.min ?? 1) &&
          value.slug.length <=
            (args.slug?.validation?.length?.max ?? Infinity) &&
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
  },
  integer({
    label,
    defaultValue = 0,
  }: {
    label: string;
    defaultValue?: number;
  }): BasicFormField<number, undefined> {
    const validate = (value: unknown) => {
      return typeof value === 'number' && Number.isFinite(value);
    };
    return {
      kind: 'form',
      Input({ value, onChange, autoFocus, forceValidation }) {
        const [blurred, setBlurred] = useState(false);
        const [inputValue, setInputValue] = useState(String(value));
        const showValidation = forceValidation || (blurred && !validate(value));

        return (
          <TextField
            label={label}
            errorMessage={
              showValidation ? 'Please specify an integer' : undefined
            }
            onBlur={() => setBlurred(true)}
            autoFocus={autoFocus}
            value={inputValue}
            onChange={raw => {
              setInputValue(raw);
              if (/^[+-]?\d+$/.test(raw)) {
                onChange(Number(raw));
              } else {
                onChange(NaN);
              }
            }}
          />
        );
      },
      options: undefined,
      defaultValue,
      validate,
    };
  },
  url({
    label,
    defaultValue = '',
  }: {
    label: string;
    defaultValue?: string;
  }): BasicFormField<string, undefined> {
    const validate = (value: unknown) => {
      return typeof value === 'string' && (value === '' || isValidURL(value));
    };
    return {
      kind: 'form',
      Input({ value, onChange, autoFocus, forceValidation }) {
        const [blurred, setBlurred] = useState(false);
        const showValidation = forceValidation || (blurred && !validate(value));
        return (
          <TextField
            width="initial"
            maxWidth={`calc(${tokenSchema.size.alias.singleLineWidth} * 3)`}
            label={label}
            autoFocus={autoFocus}
            value={value}
            onChange={onChange}
            onBlur={() => {
              setBlurred(true);
            }}
            errorMessage={
              showValidation ? 'Please provide a valid URL' : undefined
            }
          />
        );
      },
      options: undefined,
      defaultValue,
      validate,
    };
  },
  pathReference({
    label,
    pattern,
  }: {
    label: string;
    pattern?: string;
  }): BasicFormField<string | null, undefined> {
    const match = pattern ? filter(pattern) : () => true;
    return {
      kind: 'form',
      Input({ value, onChange, autoFocus }) {
        const tree = useTree().current;
        const options = useMemo(() => {
          const files =
            tree.kind === 'loaded' ? [...tree.data.entries.values()] : [];
          return files.filter(val => match(val.path));
        }, [tree]);
        return (
          <Combobox
            label={label}
            selectedKey={value}
            onSelectionChange={key => {
              if (typeof key === 'string' || key === null) {
                onChange(key);
              }
            }}
            autoFocus={autoFocus}
            defaultItems={options}
            width="auto"
          >
            {item => <Item key={item.path}>{item.path}</Item>}
          </Combobox>
        );
      },
      options: undefined,
      defaultValue: null,
      validate: val => typeof val === 'string' || val === null,
    };
  },
  relationship({
    label,
    collection,
  }: {
    label: string;
    collection: string;
  }): BasicFormField<string | null, undefined> {
    return {
      kind: 'form',
      Input({ value, onChange, autoFocus }) {
        const slugs = useSlugsInCollection(collection);
        const options = useMemo(() => {
          return slugs.map(slug => ({ slug }));
        }, [slugs]);
        return (
          <Combobox
            label={label}
            selectedKey={value}
            onSelectionChange={key => {
              if (typeof key === 'string' || key === null) {
                onChange(key);
              }
            }}
            autoFocus={autoFocus}
            defaultItems={options}
            width="auto"
          >
            {item => <Item key={item.slug}>{item.slug}</Item>}
          </Combobox>
        );
      },
      options: undefined,
      defaultValue: null,
      validate: val => typeof val === 'string' || val === null,
    };
  },
  select<Option extends { label: string; value: string }>({
    label,
    options,
    defaultValue,
  }: {
    label: string;
    options: readonly Option[];
    defaultValue: Option['value'];
  }): BasicFormField<Option['value'], readonly Option[]> {
    const optionValuesSet = new Set(options.map(x => x.value));
    if (!optionValuesSet.has(defaultValue)) {
      throw new Error(
        `A defaultValue of ${defaultValue} was provided to a select field but it does not match the value of one of the options provided`
      );
    }
    return {
      kind: 'form',
      Input({ value, onChange, autoFocus }) {
        return (
          <Picker
            label={label}
            items={options}
            selectedKey={value}
            onSelectionChange={key => {
              onChange(key as Option['value']);
            }}
            autoFocus={autoFocus}
          >
            {item => <Item key={item.value}>{item.label}</Item>}
          </Picker>
        );
      },
      options,
      defaultValue,
      validate(value) {
        return typeof value === 'string' && optionValuesSet.has(value);
      },
    };
  },
  multiselect<Option extends { label: string; value: string }>({
    label,
    options,
    defaultValue = [],
  }: {
    label: string;
    options: readonly Option[];
    defaultValue?: readonly Option['value'][];
  }): BasicFormField<readonly Option['value'][], readonly Option[]> {
    const valuesToOption = new Map(options.map(x => [x.value, x]));
    return {
      kind: 'form',
      Input({ value, onChange }) {
        const labelId = useId();
        return (
          <Flex
            role="group"
            aria-labelledby={labelId}
            direction="column"
            gap="medium"
          >
            <FieldLabel elementType="span" id={labelId}>
              {label}
            </FieldLabel>
            {options.map(option => (
              <Checkbox
                isSelected={value.includes(option.value)}
                onChange={() => {
                  if (value.includes(option.value)) {
                    onChange(value.filter(x => x !== option.value));
                  } else {
                    onChange([...value, option.value]);
                  }
                }}
              >
                {option.label}
              </Checkbox>
            ))}
          </Flex>
        );
      },
      options,
      defaultValue,
      validate(value) {
        return (
          Array.isArray(value) &&
          value.every(
            value => typeof value === 'string' && valuesToOption.has(value)
          )
        );
      },
    };
  },
  checkbox({
    label,
    defaultValue = false,
  }: {
    label: string;
    defaultValue?: boolean;
  }): BasicFormField<boolean, undefined> {
    return {
      kind: 'form',
      Input({ value, onChange, autoFocus }) {
        return (
          <Checkbox
            isSelected={value}
            onChange={onChange}
            autoFocus={autoFocus}
          >
            {label}
          </Checkbox>
        );
      },
      options: undefined,
      defaultValue,
      validate(value) {
        return typeof value === 'boolean';
      },
    };
  },
  image({
    label,
  }: {
    label: string;
  }): FormFieldWithFileNotRequiringContentsForReader<
    | {
        kind: 'uploaded';
        data: Uint8Array;
        extension: string;
        filename: string;
      }
    | { kind: 'none' },
    undefined,
    string | null
  > {
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
    return {
      kind: 'form',
      Input({ onChange, value }) {
        const inputRef = useRef<HTMLInputElement | null>(null);
        const isInEditor = useIsInDocumentEditor();
        const objectUrl = useObjectURL(
          value.kind === 'uploaded' ? value.data : null
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
        const inputKey = useMemo(() => Math.random(), [value]);
        return (
          <Flex direction="column" gap="medium">
            <FieldLabel>{label}</FieldLabel>

            <ButtonGroup>
              <ActionButton
                onPress={() => {
                  inputRef.current?.click();
                }}
              >
                Choose file
              </ActionButton>
              {value.kind === 'uploaded' && (
                <ActionButton
                  prominence="low"
                  onPress={() => {
                    onChange({ kind: 'none' });
                  }}
                >
                  Remove
                </ActionButton>
              )}
            </ButtonGroup>

            {objectUrl && (
              <Box
                alignSelf="start"
                backgroundColor="canvas"
                borderRadius="regular"
                border="neutral"
                padding="regular"
              >
                <img
                  src={objectUrl}
                  alt=""
                  style={{
                    display: 'block',
                    maxHeight: tokenSchema.size.alias.singleLineWidth,
                    maxWidth: '100%',
                  }}
                />
              </Box>
            )}
            <input
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              key={inputKey}
              ref={inputRef}
              onChange={async event => {
                const file = event.target.files?.[0];
                const extension = file?.name.match(/\.([^.]+$)/)?.[1];
                if (file && extension) {
                  onChange({
                    kind: 'uploaded',
                    data: new Uint8Array(await file.arrayBuffer()),
                    extension,
                    filename: file.name,
                  });
                }
              }}
            />
            {isInEditor && value.kind === 'uploaded' && (
              <TextField
                label="Filename"
                onChange={filename => {
                  onChange({ ...value, filename });
                }}
                value={value.filename}
              />
            )}
          </Flex>
        );
      },
      options: undefined,
      defaultValue: { kind: 'none' },
      validate() {
        return true;
      },
      serializeToFile: {
        kind: 'asset',
        filename(value, suggestedFilenamePrefix) {
          if (typeof value === 'string') return value;
          if (
            typeof value === 'object' &&
            value !== null &&
            'extension' in value &&
            typeof value.extension === 'string'
          ) {
            return suggestedFilenamePrefix + '.' + value.extension;
          }
        },
        parse({ content, value }) {
          return content
            ? {
                kind: 'uploaded',
                data: content,
                extension:
                  value && typeof value === 'object' && 'extension' in value
                    ? (value as any).extension
                    : typeof value === 'string'
                    ? value.match(/\.([^.]+$)/)?.[1]
                    : '',
                filename: typeof value === 'string' ? value : '',
              }
            : { kind: 'none' };
        },
        serialize(value, suggestedFilenamePrefix) {
          if (value.kind === 'none') {
            return { value: null, content: undefined };
          }
          const filename = suggestedFilenamePrefix
            ? suggestedFilenamePrefix + '.' + value.extension
            : value.filename;
          return { value: filename, content: value.data, filename };
        },
        reader: {
          requiresContentInReader: false,
          parseToReader({ value, suggestedFilenamePrefix }) {
            if (!value) return null;
            return typeof value === 'string'
              ? value
              : suggestedFilenamePrefix + '.' + (value as any).extension;
          },
        },
      },
    };
  },
  date({ label }: { label: string }): BasicFormField<string | null, undefined> {
    return {
      kind: 'form',
      Input({ value, onChange, autoFocus }) {
        return (
          <TextField
            label={label}
            type="date"
            onChange={val => {
              onChange(val === '' ? null : val);
            }}
            autoFocus={autoFocus}
            value={value === null ? '' : value}
          />
        );
      },
      options: undefined,
      defaultValue: null,
      validate(value) {
        return (
          value === null ||
          (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
        );
      },
    };
  },
  empty(): BasicFormField<null, undefined> {
    return {
      kind: 'form',
      Input() {
        return null;
      },
      options: undefined,
      defaultValue: null,
      validate(value) {
        return value === null || value === undefined;
      },
    };
  },
  child(
    options:
      | {
          kind: 'block';
          placeholder: string;
          formatting?: BlockFormattingConfig | 'inherit';
          dividers?: 'inherit';
          links?: 'inherit';
          relationships?: 'inherit';
        }
      | {
          kind: 'inline';
          placeholder: string;
          formatting?:
            | 'inherit'
            | {
                inlineMarks?: InlineMarksConfig;
                softBreaks?: 'inherit';
              };
          links?: 'inherit';
          relationships?: 'inherit';
        }
  ): ChildField {
    return {
      kind: 'child',
      options:
        options.kind === 'block'
          ? {
              kind: 'block',
              placeholder: options.placeholder,
              dividers: options.dividers,
              formatting:
                options.formatting === 'inherit'
                  ? {
                      blockTypes: 'inherit',
                      headingLevels: 'inherit',
                      inlineMarks: 'inherit',
                      listTypes: 'inherit',
                      alignment: 'inherit',
                      softBreaks: 'inherit',
                    }
                  : options.formatting,
              links: options.links,
              relationships: options.relationships,
            }
          : {
              kind: 'inline',
              placeholder: options.placeholder,
              formatting:
                options.formatting === 'inherit'
                  ? { inlineMarks: 'inherit', softBreaks: 'inherit' }
                  : options.formatting,
              links: options.links,
              relationships: options.relationships,
            },
    };
  },
  object<Fields extends Record<string, ComponentSchema>>(
    fields: Fields
  ): ObjectField<Fields> {
    return { kind: 'object', fields };
  },
  conditional<
    DiscriminantField extends BasicFormField<string | boolean, any>,
    ConditionalValues extends {
      [Key in `${DiscriminantField['defaultValue']}`]: ComponentSchema;
    }
  >(
    discriminant: DiscriminantField,
    values: ConditionalValues
  ): ConditionalField<DiscriminantField, ConditionalValues> {
    if (
      (discriminant.validate('true') || discriminant.validate('false')) &&
      (discriminant.validate(true) || discriminant.validate(false))
    ) {
      throw new Error(
        'The discriminant of a conditional field only supports string values, or boolean values, not both.'
      );
    }
    return {
      kind: 'conditional',
      discriminant,
      values: values,
    };
  },
  document({
    label,
    componentBlocks = {},
    ...documentFeaturesConfig
  }: {
    label: string;
    componentBlocks?: Record<string, ComponentBlock>;
  } & DocumentFeaturesConfig): FormFieldWithFileRequiringContentsForReader<
    DocumentElement[],
    undefined,
    DocumentElement[]
  > {
    const documentFeatures = normaliseDocumentFeatures(documentFeaturesConfig);
    const parse =
      (mode: 'read' | 'edit') =>
      (value: {
        value: unknown;
        primary: Uint8Array | undefined;
        other: { [key: string]: Uint8Array };
      }): DocumentElement[] => {
        const markdoc = textDecoder.decode(value.primary);
        const document = fromMarkdoc(Markdoc.parse(markdoc), componentBlocks);
        const editor = createDocumentEditor(
          documentFeatures,
          componentBlocks,
          {}
        );
        editor.children = document;
        Editor.normalize(editor, { force: true });
        return deserializeFiles(
          editor.children,
          componentBlocks,
          value.other,
          mode
        ) as any;
      };
    return {
      kind: 'form',
      defaultValue: [{ type: 'paragraph', children: [{ text: '' }] }],
      Input(props) {
        return (
          <FieldPrimitive label={label}>
            <DocumentEditor
              componentBlocks={componentBlocks}
              documentFeatures={documentFeatures}
              onChange={props.onChange as any}
              relationships={emptyObject}
              value={props.value as any}
            />
          </FieldPrimitive>
        );
      },
      options: undefined,
      validate() {
        return true;
      },
      serializeToFile: {
        kind: 'multi',
        primaryExtension: '.mdoc',
        files(value) {
          if (!value) {
            return [];
          }
          return (value as any).files ?? [];
        },
        parse: parse('edit'),
        async serialize(value) {
          const collectedFiles: CollectedFile[] = [];
          const transformed = collectFiles(
            value as any,
            componentBlocks,
            collectedFiles
          );

          return {
            primary: textEncoder.encode(
              Markdoc.format(
                Markdoc.parse(
                  Markdoc.format(
                    toMarkdocDocument(
                      transformed as ElementFromValidation[],
                      componentBlocks
                    )
                  )
                )
              )
            ),
            other: Object.fromEntries(
              collectedFiles.map(({ filename, data }) => [filename, data])
            ),
            value: { files: collectedFiles.map(({ filename }) => filename) },
          };
        },
        reader: {
          requiresContentInReader: true,
          parseToReader: parse('read'),
        },
      },
    };
  },
  array<ElementField extends ComponentSchema>(
    element: ElementField,
    opts?: {
      label?: string;
      itemLabel?: (props: GenericPreviewProps<ElementField, unknown>) => string;
      asChildTag?: string;
    }
  ): ArrayField<ElementField> {
    return {
      kind: 'array',
      element,
      label: opts?.label ?? 'Items',
      itemLabel: opts?.itemLabel,
      asChildTag: opts?.asChildTag,
    };
  },
};

export type ComponentBlock<
  Fields extends Record<string, ComponentSchema> = Record<
    string,
    ComponentSchema
  >
> = {
  preview: (props: any) => ReactElement | null;
  schema: Fields;
  label: string;
} & (
  | {
      chromeless: true;
      toolbar?: (props: {
        props: Record<string, any>;
        onRemove(): void;
      }) => ReactElement;
    }
  | {
      chromeless?: false;
      toolbar?: (props: {
        props: Record<string, any>;
        onShowEditMode(): void;
        onRemove(): void;
        isValid: boolean;
      }) => ReactElement;
    }
);

type ChildFieldPreviewProps<Schema extends ChildField, ChildFieldElement> = {
  readonly element: ChildFieldElement;
  readonly schema: Schema;
};

type FormFieldPreviewProps<Schema extends FormField<any, any>> = {
  readonly value: Schema['defaultValue'];
  onChange(value: Schema['defaultValue']): void;
  readonly options: Schema['options'];
  readonly schema: Schema;
};

type ObjectFieldPreviewProps<
  Schema extends ObjectField<any>,
  ChildFieldElement
> = {
  readonly fields: {
    readonly [Key in keyof Schema['fields']]: GenericPreviewProps<
      Schema['fields'][Key],
      ChildFieldElement
    >;
  };
  onChange(value: {
    readonly [Key in keyof Schema['fields']]?: InitialOrUpdateValueFromComponentPropField<
      Schema['fields'][Key]
    >;
  }): void;
  readonly schema: Schema;
};

type ConditionalFieldPreviewProps<
  Schema extends ConditionalField<BasicFormField<string | boolean, any>, any>,
  ChildFieldElement
> = {
  readonly [Key in keyof Schema['values']]: {
    readonly discriminant: DiscriminantStringToDiscriminantValue<
      Schema['discriminant'],
      Key
    >;
    onChange<Discriminant extends Schema['discriminant']['defaultValue']>(
      discriminant: Discriminant,
      value?: InitialOrUpdateValueFromComponentPropField<
        Schema['values'][`${Discriminant}`]
      >
    ): void;
    readonly options: Schema['discriminant']['options'];
    readonly value: GenericPreviewProps<
      Schema['values'][Key],
      ChildFieldElement
    >;
    readonly schema: Schema;
  };
}[keyof Schema['values']];

type ArrayFieldPreviewProps<
  Schema extends ArrayField<ComponentSchema>,
  ChildFieldElement
> = {
  readonly elements: readonly (GenericPreviewProps<
    Schema['element'],
    ChildFieldElement
  > & {
    readonly key: string;
  })[];
  readonly onChange: (
    value: readonly {
      key: string | undefined;
      value?: InitialOrUpdateValueFromComponentPropField<Schema['element']>;
    }[]
  ) => void;
  readonly schema: Schema;
};

export type GenericPreviewProps<
  Schema extends ComponentSchema,
  ChildFieldElement
> = Schema extends ChildField
  ? ChildFieldPreviewProps<Schema, ChildFieldElement>
  : Schema extends FormField<any, any>
  ? FormFieldPreviewProps<Schema>
  : Schema extends ObjectField<any>
  ? ObjectFieldPreviewProps<Schema, ChildFieldElement>
  : Schema extends ConditionalField<any, any>
  ? ConditionalFieldPreviewProps<Schema, ChildFieldElement>
  : Schema extends ArrayField<any>
  ? ArrayFieldPreviewProps<Schema, ChildFieldElement>
  : never;

export type PreviewProps<Schema extends ComponentSchema> = GenericPreviewProps<
  Schema,
  ReactNode
>;

export type InitialOrUpdateValueFromComponentPropField<
  Schema extends ComponentSchema
> = Schema extends ChildField
  ? undefined
  : Schema extends FormField<infer Value, any>
  ? Value | undefined
  : Schema extends ObjectField<infer Value>
  ? {
      readonly [Key in keyof Value]?: InitialOrUpdateValueFromComponentPropField<
        Value[Key]
      >;
    }
  : Schema extends ConditionalField<infer DiscriminantField, infer Values>
  ? {
      readonly [Key in keyof Values]: {
        readonly discriminant: DiscriminantStringToDiscriminantValue<
          DiscriminantField,
          Key
        >;
        readonly value?: InitialOrUpdateValueFromComponentPropField<
          Values[Key]
        >;
      };
    }[keyof Values]
  : Schema extends ArrayField<infer ElementField>
  ? readonly {
      key: string | undefined;
      value?: InitialOrUpdateValueFromComponentPropField<ElementField>;
    }[]
  : never;

type DiscriminantStringToDiscriminantValue<
  DiscriminantField extends FormField<any, any>,
  DiscriminantString extends PropertyKey
> = DiscriminantField['defaultValue'] extends boolean
  ? 'true' extends DiscriminantString
    ? true
    : 'false' extends DiscriminantString
    ? false
    : never
  : DiscriminantString;

export type PreviewPropsForToolbar<Schema extends ComponentSchema> =
  GenericPreviewProps<Schema, undefined>;

export type HydratedRelationshipData = {
  id: string;
  label: string;
  data: Record<string, any>;
};

export type RelationshipData = {
  id: string;
  label: string | undefined;
  data: Record<string, any> | undefined;
};

export function component<
  Schema extends {
    [Key in any]: ComponentSchema;
  }
>(
  options: {
    /** The preview component shown in the editor */
    preview: (props: PreviewProps<ObjectField<Schema>>) => ReactElement | null;
    /** The schema for the props that the preview component, toolbar and rendered component will receive */
    schema: Schema;
    /** The label to show in the insert menu and chrome around the block if chromeless is false */
    label: string;
  } & (
    | {
        chromeless: true;
        toolbar?: (props: {
          props: PreviewPropsForToolbar<ObjectField<Schema>>;
          onRemove(): void;
        }) => ReactElement;
      }
    | {
        chromeless?: false;
        toolbar?: (props: {
          props: PreviewPropsForToolbar<ObjectField<Schema>>;
          onShowEditMode(): void;
          onRemove(): void;
        }) => ReactElement;
      }
  )
): ComponentBlock<Schema> {
  return options as any;
}

export function NotEditable({ children, ...props }: BoxProps) {
  return (
    <Box
      elementType="span"
      UNSAFE_className={css({ userSelect: 'none', whiteSpace: 'initial' })}
      contentEditable={false}
      {...props}
    >
      {children}
    </Box>
  );
}

type Comp<Props> = (props: Props) => ReactElement | null;

export type ValueForComponentSchema<Schema extends ComponentSchema> =
  Schema extends ChildField
    ? null
    : Schema extends FormField<infer Value, any>
    ? Value
    : Schema extends ObjectField<infer Value>
    ? {
        readonly [Key in keyof Value]: ValueForComponentSchema<Value[Key]>;
      }
    : Schema extends ConditionalField<infer DiscriminantField, infer Values>
    ? {
        readonly [Key in keyof Values]: {
          readonly discriminant: DiscriminantStringToDiscriminantValue<
            DiscriminantField,
            Key
          >;
          readonly value: ValueForComponentSchema<Values[Key]>;
        };
      }[keyof Values]
    : Schema extends ArrayField<infer ElementField>
    ? readonly ValueForComponentSchema<ElementField>[]
    : never;

export type ValueForReading<Schema extends ComponentSchema> =
  Schema extends ChildField
    ? null
    : Schema extends FormFieldWithFileRequiringContentsForReader<
        any,
        any,
        infer Value
      >
    ? () => Promise<Value>
    : Schema extends FormFieldWithFileNotRequiringContentsForReader<
        any,
        any,
        infer Value
      >
    ? Value
    : Schema extends SlugFormField<infer Value, any, any>
    ? Value
    : Schema extends BasicFormField<infer Value, any>
    ? Value
    : Schema extends ObjectField<infer Value>
    ? {
        readonly [Key in keyof Value]: ValueForReading<Value[Key]>;
      }
    : Schema extends ConditionalField<infer DiscriminantField, infer Values>
    ? {
        readonly [Key in keyof Values]: {
          readonly discriminant: DiscriminantStringToDiscriminantValue<
            DiscriminantField,
            Key
          >;
          readonly value: ValueForReading<Values[Key]>;
        };
      }[keyof Values]
    : Schema extends ArrayField<infer ElementField>
    ? readonly ValueForReading<ElementField>[]
    : never;

export type InferRenderersForComponentBlocks<
  ComponentBlocks extends Record<string, ComponentBlock<any>>
> = {
  [Key in keyof ComponentBlocks]: Comp<
    ValueForReading<ObjectField<ComponentBlocks[Key]['schema']>>
  >;
};

<Flex gap="small" alignItems="end">
  <TextField flex={1} />
  <ActionButton />
</Flex>;
