import { assertNever } from 'emery';

import { DocumentFeatures } from '../document-features';
import { DocumentFeaturesForNormalization } from '../document-features-normalization';
import { Mark } from '../utils';
import { ComponentSchema, ChildField } from '../../../../api';
import { Descendant, Element } from 'slate';

export type DocumentFeaturesForChildField =
  | {
      kind: 'inline';
      inlineMarks: 'inherit' | DocumentFeatures['formatting']['inlineMarks'];
      documentFeatures: {
        links: boolean;
      };
      softBreaks: boolean;
    }
  | {
      kind: 'block';
      inlineMarks: 'inherit' | DocumentFeatures['formatting']['inlineMarks'];
      softBreaks: boolean;
      componentBlocks: boolean;
      documentFeatures: DocumentFeaturesForNormalization;
    };

export function getWholeDocumentFeaturesForChildField(
  editorDocumentFeatures: DocumentFeatures,
  options: ChildField['options'] & { kind: 'block' }
): DocumentFeatures {
  const inlineMarksFromOptions = options.formatting?.inlineMarks;

  const inlineMarks = Object.fromEntries(
    Object.keys(editorDocumentFeatures.formatting.inlineMarks).map(_mark => {
      const mark = _mark as Mark;
      return [
        mark,
        inlineMarksFromOptions === 'inherit' ||
        inlineMarksFromOptions?.[mark] === 'inherit'
          ? editorDocumentFeatures.formatting.inlineMarks[mark]
          : false,
      ];
    })
  ) as Record<Mark, boolean>;
  const headingLevels = options.formatting?.headingLevels;
  return {
    formatting: {
      inlineMarks,
      softBreaks:
        options.formatting?.softBreaks === 'inherit' &&
        editorDocumentFeatures.formatting.softBreaks,
      alignment: {
        center:
          editorDocumentFeatures.formatting.alignment.center &&
          options.formatting?.alignment === 'inherit',
        end:
          editorDocumentFeatures.formatting.alignment.end &&
          options.formatting?.alignment === 'inherit',
      },
      blockTypes:
        options.formatting?.blockTypes === 'inherit'
          ? editorDocumentFeatures.formatting.blockTypes
          : { blockquote: false, code: false },
      headings:
        headingLevels === 'inherit'
          ? editorDocumentFeatures.formatting.headings
          : {
              levels: headingLevels
                ? editorDocumentFeatures.formatting.headings.levels.filter(
                    level => headingLevels.includes(level)
                  )
                : [],
              schema: editorDocumentFeatures.formatting.headings.schema,
            },
      listTypes:
        options.formatting?.listTypes === 'inherit'
          ? editorDocumentFeatures.formatting.listTypes
          : { ordered: false, unordered: false },
    },
    dividers:
      options.dividers === 'inherit' ? editorDocumentFeatures.dividers : false,
    images: options.images === 'inherit' && editorDocumentFeatures.images,
    layouts: [],
    links: options.links === 'inherit' && editorDocumentFeatures.links,
    tables: options.tables === 'inherit' && editorDocumentFeatures.tables,
  };
}

export function getDocumentFeaturesForChildField(
  editorDocumentFeatures: DocumentFeatures,
  options: ChildField['options']
): DocumentFeaturesForChildField {
  // an important note for this: normalization based on document features
  // is done based on the document features returned here
  // and the editor document features
  // so the result for any given child prop will be the things that are
  // allowed by both these document features
  // AND the editor document features
  const inlineMarksFromOptions = options.formatting?.inlineMarks;

  const inlineMarks =
    inlineMarksFromOptions === 'inherit'
      ? 'inherit'
      : (Object.fromEntries(
          Object.keys(editorDocumentFeatures.formatting.inlineMarks).map(
            mark => {
              return [
                mark as Mark,
                !!(inlineMarksFromOptions || {})[mark as Mark],
              ];
            }
          )
        ) as Record<Mark, boolean>);
  if (options.kind === 'inline') {
    return {
      kind: 'inline',
      inlineMarks,
      documentFeatures: {
        links: options.links === 'inherit',
      },
      softBreaks: options.formatting?.softBreaks === 'inherit',
    };
  }
  const headingLevels = options.formatting?.headingLevels;
  return {
    kind: 'block',
    inlineMarks,
    softBreaks: options.formatting?.softBreaks === 'inherit',
    documentFeatures: {
      layouts: [],
      dividers:
        options.dividers === 'inherit'
          ? editorDocumentFeatures.dividers
          : false,
      formatting: {
        alignment:
          options.formatting?.alignment === 'inherit'
            ? editorDocumentFeatures.formatting.alignment
            : {
                center: false,
                end: false,
              },
        blockTypes:
          options.formatting?.blockTypes === 'inherit'
            ? editorDocumentFeatures.formatting.blockTypes
            : {
                blockquote: false,
                code: false,
              },
        headings:
          headingLevels === 'inherit'
            ? editorDocumentFeatures.formatting.headings
            : {
                levels: headingLevels
                  ? editorDocumentFeatures.formatting.headings.levels.filter(
                      level => headingLevels.includes(level)
                    )
                  : [],
                schema: editorDocumentFeatures.formatting.headings.schema,
              },
        listTypes:
          options.formatting?.listTypes === 'inherit'
            ? editorDocumentFeatures.formatting.listTypes
            : {
                ordered: false,
                unordered: false,
              },
      },
      links: options.links === 'inherit',
      images:
        options.images === 'inherit' ? editorDocumentFeatures.images : false,
      tables: options.tables === 'inherit',
    },
    componentBlocks: options.componentBlocks === 'inherit',
  };
}

function getSchemaAtPropPathInner(
  path: (string | number)[],
  value: unknown,
  schema: ComponentSchema
): undefined | ComponentSchema {
  // because we're checking the length here
  // the non-null asserts on shift below are fine
  if (path.length === 0) {
    return schema;
  }
  if (schema.kind === 'child' || schema.kind === 'form') {
    return;
  }
  if (schema.kind === 'conditional') {
    const key = path.shift();
    if (key === 'discriminant') {
      return getSchemaAtPropPathInner(
        path,
        (value as any).discriminant,
        schema.discriminant
      );
    }
    if (key === 'value') {
      const propVal = schema.values[(value as any).discriminant];
      return getSchemaAtPropPathInner(path, (value as any).value, propVal);
    }
    return;
  }
  if (schema.kind === 'object') {
    const key = path.shift()!;
    return getSchemaAtPropPathInner(
      path,
      (value as any)[key],
      schema.fields[key]
    );
  }
  if (schema.kind === 'array') {
    const index = path.shift()!;
    return getSchemaAtPropPathInner(
      path,
      (value as any)[index],
      schema.element
    );
  }
  assertNever(schema);
}

export function getSchemaAtPropPath(
  path: ReadonlyPropPath,
  value: Record<string, unknown>,
  props: Record<string, ComponentSchema>
): undefined | ComponentSchema {
  return getSchemaAtPropPathInner([...path], value, {
    kind: 'object',
    fields: props,
  });
}

export function getAncestorSchemas(
  rootSchema: ComponentSchema,
  path: ReadonlyPropPath,
  value: unknown
) {
  const ancestors: ComponentSchema[] = [];
  const currentPath = [...path];
  let currentProp = rootSchema;
  let currentValue = value;
  while (currentPath.length) {
    ancestors.push(currentProp);
    const key = currentPath.shift()!; // this code only runs when path.length is truthy so this non-null assertion is fine
    if (currentProp.kind === 'array') {
      currentProp = currentProp.element;
      currentValue = (currentValue as any)[key];
    } else if (currentProp.kind === 'conditional') {
      currentProp = currentProp.values[(value as any).discriminant];
      currentValue = (currentValue as any).value;
    } else if (currentProp.kind === 'object') {
      currentValue = (currentValue as any)[key];
      currentProp = currentProp.fields[key];
    } else if (currentProp.kind === 'child' || currentProp.kind === 'form') {
      throw new Error(`unexpected prop "${key}"`);
    } else {
      assertNever(currentProp);
    }
  }
  return ancestors;
}

export type ReadonlyPropPath = readonly (string | number)[];

export function getPlaceholderTextForPropPath(
  propPath: ReadonlyPropPath,
  fields: Record<string, ComponentSchema>,
  formProps: Record<string, any>
): string {
  const field = getSchemaAtPropPath(propPath, formProps, fields);
  if (
    field?.kind === 'child' &&
    ((field.options.kind === 'block' && field.options.editIn !== 'modal') ||
      field.options.kind === 'inline')
  ) {
    return field.options.placeholder;
  }
  return '';
}

export function cloneDescendent(node: Descendant): Descendant {
  if (Element.isElement(node)) {
    return {
      ...node,
      children: node.children.map(cloneDescendent),
    };
  }
  return { ...node };
}
