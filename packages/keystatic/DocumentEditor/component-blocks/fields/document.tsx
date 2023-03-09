import Markdoc from '@markdoc/markdoc';

import { FieldPrimitive } from '@voussoir/field';
import { Editor } from 'slate';

import { fromMarkdoc } from '../../../markdoc/from-markdoc';
import { toMarkdocDocument } from '../../../markdoc/to-markdoc';
import { createDocumentEditorWithoutReact, DocumentEditor } from '../..';
import { DocumentFeatures } from '../../document-features';
import {
  CollectedFile,
  collectFiles,
  deserializeFiles,
} from '../document-field';
import { ElementFromValidation } from '../../../structure-validation';
import { collectDirectoriesUsedInSchema } from '../../../app/tree-key';
import {
  ComponentBlock,
  DocumentElement,
  fields,
  FormFieldWithFileRequiringContentsForReader,
} from '../api';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

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
  images?: true | { directory?: string; publicPath?: string };
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
    images: config.images === undefined ? false : config.images,
  };
  return documentFeatures;
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
  undefined,
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
      const editor = createDocumentEditorWithoutReact(
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
        <FieldPrimitive label={label} description={description}>
          <DocumentEditor
            componentBlocks={componentBlocks}
            documentFeatures={documentFeatures}
            onChange={props.onChange as any}
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
      directories: [
        ...collectDirectoriesUsedInSchema(
          fields.object(
            Object.fromEntries(
              Object.entries(componentBlocks).map(([name, block]) => [
                name,
                fields.object(block.schema),
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
                    toMarkdocDocument(
                      transformed as ElementFromValidation[],
                      componentBlocks
                    )
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
