import { parse } from '#markdoc';

import { fromMarkdoc } from './markdoc/from-markdoc';
import { DocumentFeatures } from './DocumentEditor/document-features';
import { deserializeFiles } from './DocumentEditor/component-blocks/document-field';
import { collectDirectoriesUsedInSchema } from '../../../app/tree-key';
import {
  BasicFormField,
  ComponentBlock,
  ComponentSchema,
  DocumentElement,
  ContentFormField,
  SlugFormField,
} from '../../api';
import { text } from '../text';
import {
  DocumentFieldInput,
  normalizeDocumentFieldChildren,
  serializeMarkdoc,
} from '#field-ui/document';
import { object } from '../object';
import { FieldDataError } from '../error';
import { basicFormFieldWithSimpleReaderParse } from '../utils';
import { fixPath } from '../../../app/path-utils';

const textDecoder = new TextDecoder();

type HeadingLevels = true | readonly (1 | 2 | 3 | 4 | 5 | 6)[];

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
  headingLevels?:
    | HeadingLevels
    | {
        levels: HeadingLevels;
        schema?: Record<string, ComponentSchema>;
      };
  blockTypes?:
    | true
    | {
        blockquote?: true;
        code?: true | { schema?: Record<string, ComponentSchema> };
      };
  softBreaks?: true;
};

export type BasicStringFormField =
  | BasicFormField<string>
  | SlugFormField<string, string, string, null>;

type DocumentFeaturesConfig = {
  formatting?: true | FormattingConfig;
  links?: true;
  dividers?: true;
  images?:
    | true
    | {
        directory?: string;
        publicPath?: string;
        schema?: {
          alt?: BasicStringFormField;
          title?: BasicStringFormField;
        };
      };
  layouts?: readonly (readonly [number, ...number[]])[];
  tables?: true;
};

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

export function normaliseDocumentFeatures(
  config: DocumentFeaturesConfig
): DocumentFeatures {
  const formatting: FormattingConfig =
    config.formatting === true
      ? {
          // alignment: true, // not supported natively in markdown
          blockTypes: true,
          headingLevels: true,
          inlineMarks: true,
          listTypes: true,
          softBreaks: true,
        }
      : config.formatting ?? {};
  const imagesConfig = config.images === true ? {} : config.images;
  return {
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
          ? { blockquote: true, code: { schema: object({}) } }
          : {
              blockquote: !!formatting.blockTypes?.blockquote,
              code: (() => {
                if (formatting.blockTypes?.code === undefined) {
                  return false as const;
                }
                if (
                  formatting.blockTypes.code === true ||
                  !formatting.blockTypes.code.schema
                ) {
                  return { schema: object({}) };
                }
                for (const key of ['type', 'children', 'language']) {
                  if (key in formatting.blockTypes.code.schema) {
                    throw new Error(
                      `"${key}" cannot be a key in the schema for code blocks`
                    );
                  }
                }
                return { schema: object(formatting.blockTypes.code.schema) };
              })(),
            },
      headings: (() => {
        const opt = formatting?.headingLevels;
        const obj =
          typeof opt === 'object' && 'levels' in opt
            ? opt
            : { levels: opt, schema: undefined };
        if (obj.schema) {
          for (const key of ['type', 'children', 'level', 'textAlign']) {
            if (key in obj.schema) {
              throw new Error(
                `"${key}" cannot be a key in the schema for headings`
              );
            }
          }
        }
        return {
          levels: [
            ...new Set(
              obj.levels === true ? ([1, 2, 3, 4, 5, 6] as const) : obj.levels
            ),
          ],
          schema: object(obj.schema ?? {}),
        };
      })(),
      inlineMarks:
        formatting.inlineMarks === true
          ? {
              bold: true,
              code: true,
              italic: true,
              keyboard: false, // not supported natively in markdown
              strikethrough: true,
              subscript: false, // not supported natively in markdown
              superscript: false, // not supported natively in markdown
              underline: false, // not supported natively in markdown
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
    images:
      imagesConfig === undefined
        ? false
        : {
            ...imagesConfig,
            schema: {
              alt: imagesConfig.schema?.alt ?? defaultAltField,
              title: imagesConfig.schema?.title ?? emptyTitleField,
            },
          },
    tables: !!config.tables,
  };
}

/**
 * @deprecated `fields.markdoc` has superseded this field. `fields.mdx` is also available if you prefer MDX.
 */
export function document({
  label,
  componentBlocks = {},
  description,
  ...documentFeaturesConfig
}: {
  label: string;
  componentBlocks?: Record<string, ComponentBlock>;
  description?: string;
} & DocumentFeaturesConfig): ContentFormField<
  DocumentElement[],
  DocumentElement[],
  DocumentElement[]
> {
  const documentFeatures = normaliseDocumentFeatures(documentFeaturesConfig);

  return {
    kind: 'form',
    formKind: 'content',
    defaultValue() {
      return [{ type: 'paragraph', children: [{ text: '' }] }];
    },
    Input(props) {
      return (
        <DocumentFieldInput
          componentBlocks={componentBlocks}
          description={description}
          label={label}
          documentFeatures={documentFeatures}
          {...props}
        />
      );
    },

    parse(_, data) {
      const markdoc = textDecoder.decode(data.content);
      const document = fromMarkdoc(parse(markdoc), componentBlocks);
      return deserializeFiles(
        normalizeDocumentFieldChildren(
          documentFeatures,
          componentBlocks,
          document
        ),
        componentBlocks,
        data.other,
        data.external,
        'edit',
        documentFeatures,
        data.slug
      ) as any;
    },
    contentExtension: '.mdoc',
    validate(value) {
      return value;
    },
    directories: [
      ...collectDirectoriesUsedInSchema(
        object(
          Object.fromEntries(
            Object.entries(componentBlocks).map(([name, block]) => [
              name,
              object(block.schema),
            ])
          )
        )
      ),
      ...(typeof documentFeatures.images === 'object' &&
      typeof documentFeatures.images.directory === 'string'
        ? [fixPath(documentFeatures.images.directory)]
        : []),
    ],
    serialize(value, opts) {
      return serializeMarkdoc(value, opts, componentBlocks, documentFeatures);
    },
    reader: {
      parse(value, data) {
        const markdoc = textDecoder.decode(data.content);
        const document = fromMarkdoc(parse(markdoc), componentBlocks);
        return deserializeFiles(
          document,
          componentBlocks,
          new Map(),
          new Map(),
          'read',
          documentFeatures,
          undefined
        ) as any;
      },
    },
  };
}
