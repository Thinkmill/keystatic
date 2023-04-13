import Markdoc from '@markdoc/markdoc';

import { Editor } from 'slate';

import { fromMarkdoc } from '../../../../markdoc/from-markdoc';
import { toMarkdocDocument } from '../../../../markdoc/to-markdoc';
import { DocumentFeatures } from '../../../document-features';
import {
  CollectedFile,
  collectFiles,
  deserializeFiles,
} from '../../document-field';
import { collectDirectoriesUsedInSchema } from '../../../../app/tree-key';
import {
  BasicFormField,
  ComponentBlock,
  ComponentSchema,
  DocumentElement,
  FormFieldWithFileRequiringContentsForReader,
  SlugFormField,
} from '../../api';
import { text } from '../text';
import { DocumentFieldInput } from './ui';
import { createDocumentEditorForNormalization } from '../../../create-editor';
import { object } from '../object';

const textEncoder = new TextEncoder();
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
  | SlugFormField<string, undefined>;

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

const defaultAltField: SlugFormField<string, undefined> = text({
  label: 'Alt text',
  description: 'This text will be used by screen readers and search engines.',
});

const emptyTitleField: BasicFormField<string> = {
  kind: 'form',
  Input() {
    return null;
  },
  defaultValue: '',
  validate(value) {
    return typeof value === 'string';
  },
};

export function normaliseDocumentFeatures(
  config: DocumentFeaturesConfig
): DocumentFeatures {
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

export function document({
  label,
  componentBlocks = {},
  description,
  ...documentFeaturesConfig
}: {
  label: string;
  componentBlocks?: Record<string, ComponentBlock>;
  description?: string;
} & DocumentFeaturesConfig): FormFieldWithFileRequiringContentsForReader<
  DocumentElement[],
  DocumentElement[]
> {
  const documentFeatures = normaliseDocumentFeatures(documentFeaturesConfig);
  const parse =
    (mode: 'read' | 'edit') =>
    (data: {
      value: unknown;
      primary: Uint8Array | undefined;
      other: ReadonlyMap<string, Uint8Array>;
      external?: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>;
      slug?: string;
    }): DocumentElement[] => {
      const markdoc = textDecoder.decode(data.primary);
      const document = fromMarkdoc(Markdoc.parse(markdoc), componentBlocks);
      const editor = createDocumentEditorForNormalization(
        documentFeatures,
        componentBlocks
      );
      editor.children = document;
      Editor.normalize(editor, { force: true });
      return deserializeFiles(
        editor.children,
        componentBlocks,
        data.other,
        data.external || new Map(),
        mode,
        documentFeatures,
        data.slug
      ) as any;
    };
  return {
    kind: 'form',
    defaultValue: [{ type: 'paragraph', children: [{ text: '' }] }],
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
    validate() {
      return true;
    },
    serializeToFile: {
      kind: 'multi',
      primaryExtension: '.mdoc',
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
          ? [documentFeatures.images.directory]
          : []),
      ],
      parse: parse('edit'),
      async serialize(value, slug) {
        const collectedFiles: CollectedFile[] = [];
        const transformed = collectFiles(
          value as any,
          componentBlocks,
          collectedFiles,
          documentFeatures,
          slug
        );

        const other = new Map<string, Uint8Array>();
        const external = new Map<string, Map<string, Uint8Array>>();
        for (const file of collectedFiles) {
          if (file.parent === undefined) {
            other.set(file.filename, file.data);
            continue;
          }
          if (!external.has(file.parent)) {
            external.set(file.parent, new Map());
          }
          external.get(file.parent)!.set(file.filename, file.data);
        }
        try {
          return {
            primary: textEncoder.encode(
              Markdoc.format(
                Markdoc.parse(
                  Markdoc.format(
                    toMarkdocDocument(transformed, {
                      componentBlocks,
                      documentFeatures,
                    })
                  )
                )
              )
            ),
            other,
            external,
            value: undefined,
          };
        } catch (err) {
          debugger;
          throw err;
        }
      },
      reader: {
        requiresContentInReader: true,
        parseToReader: parse('read'),
      },
    },
  };
}
