import { text } from '../text';
import { BasicFormField, SlugFormField, ComponentSchema } from '../../api';
import { FieldDataError } from '../error';
import { basicFormFieldWithSimpleReaderParse } from '../utils';

type HeadingLevels = boolean | readonly (1 | 2 | 3 | 4 | 5 | 6)[];

export type BasicStringFormField =
  | BasicFormField<string>
  | SlugFormField<string, string, string, null>;

const defaultAltField: SlugFormField<string, string, string, null> = text({
  label: 'Alt text',
  description: 'This text will be used by screen readers and search engines.',
});

const emptyTitleField: BasicFormField<string> =
  basicFormFieldWithSimpleReaderParse({
    Input() {
      return null;
    },
    defaultValue() {
      return '';
    },
    parse(value) {
      if (value === undefined) return '';
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be string');
      }
      return value;
    },
    validate(value) {
      return value;
    },
    serialize(value) {
      return { value };
    },
    label: 'Title',
  });

export type EditorConfig = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  code: boolean;
  heading: {
    levels: readonly (1 | 2 | 3 | 4 | 5 | 6)[];
    schema: Record<string, ComponentSchema>;
  };
  blockquote: boolean;
  orderedList: boolean;
  unorderedList: boolean;
  table: boolean;
  link: boolean;
  image:
    | {
        directory: string | undefined;
        publicPath: string | undefined;
        transformFilename: (originalFilename: string) => string;
        schema: {
          alt: BasicStringFormField;
          title: BasicStringFormField;
        };
      }
    | undefined;
  divider: boolean;
  codeBlock: { schema: Record<string, ComponentSchema> } | undefined;
};

export type MarkdocEditorOptions = {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  heading?:
    | HeadingLevels
    | { levels: HeadingLevels; schema: Record<string, ComponentSchema> };
  blockquote?: boolean;
  orderedList?: boolean;
  unorderedList?: boolean;
  table?: boolean;
  link?: boolean;
  image?:
    | boolean
    | {
        directory?: string;
        publicPath?: string;
        transformFilename?: (originalFilename: string) => string;
        schema?: { alt?: BasicStringFormField; title?: BasicStringFormField };
      };
  divider?: boolean;
  codeBlock?: boolean | { schema: Record<string, ComponentSchema> };
};

export type MDXEditorOptions = {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  heading?: HeadingLevels;
  blockquote?: boolean;
  orderedList?: boolean;
  unorderedList?: boolean;
  table?: boolean;
  link?: boolean;
  image?:
    | boolean
    | {
        directory?: string;
        publicPath?: string;
        transformFilename?: (originalFilename: string) => string;
        schema?: { alt?: BasicStringFormField; title?: BasicStringFormField };
      };
  divider?: boolean;
  codeBlock?: boolean;
};

type EditorOptions = MarkdocEditorOptions | MDXEditorOptions;

export function editorOptionsToConfig(options: EditorOptions): EditorConfig {
  return {
    bold: options.bold ?? true,
    italic: options.italic ?? true,
    strikethrough: options.strikethrough ?? true,
    code: options.code ?? true,
    heading: (() => {
      let levels = [];
      let levelsOpt =
        typeof options.heading === 'object' && !Array.isArray(options.heading)
          ? (options.heading as { levels: HeadingLevels }).levels
          : (options.heading as HeadingLevels | undefined);
      if (levelsOpt === true || levelsOpt === undefined) {
        levels = [1, 2, 3, 4, 5, 6];
      }
      if (Array.isArray(levelsOpt)) {
        levels = levelsOpt;
      }
      return {
        levels,
        schema:
          options.heading &&
          typeof options.heading === 'object' &&
          'schema' in options.heading
            ? options.heading.schema
            : {},
      };
    })(),
    blockquote: options.blockquote ?? true,
    orderedList: options.orderedList ?? true,
    unorderedList: options.unorderedList ?? true,
    table: options.table ?? true,
    link: options.link ?? true,
    image:
      options.image !== false
        ? (() => {
            const opts = options.image === true ? undefined : options.image;
            return {
              directory: opts?.directory,
              publicPath: opts?.publicPath,
              transformFilename: opts?.transformFilename ?? (x => x),
              schema: {
                alt: opts?.schema?.alt ?? defaultAltField,
                title: opts?.schema?.title ?? emptyTitleField,
              },
            };
          })()
        : undefined,
    divider: options.divider ?? true,
    codeBlock:
      options.codeBlock === false
        ? undefined
        : {
            schema:
              typeof options.codeBlock === 'object'
                ? options.codeBlock.schema
                : {},
          },
  };
}
