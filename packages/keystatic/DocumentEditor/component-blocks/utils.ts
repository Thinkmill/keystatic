import { assertNever } from 'emery';

import { getSlugFromState } from '../../app/utils';
import { DocumentFeatures } from '../document-features';
import { DocumentFeaturesForNormalization } from '../document-features-normalization';
import { Mark } from '../utils';
import { ComponentSchema, ChildField } from './api';
import { SlugFieldInfo } from './fields/text/ui';

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
        headingLevels:
          options.formatting?.headingLevels === 'inherit'
            ? editorDocumentFeatures.formatting.headingLevels
            : options.formatting?.headingLevels || [],
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

export function clientSideValidateProp(
  schema: ComponentSchema,
  value: any,
  slugField: SlugFieldInfo | undefined,
  path: ReadonlyPropPath = []
): boolean {
  switch (schema.kind) {
    case 'child': {
      return true;
    }
    case 'form': {
      if (slugField && path[path.length - 1] === slugField?.field) {
        return schema.validate(value, {
          slugs: slugField.slugs,
          glob: slugField.glob,
        });
      }
      return schema.validate(value, undefined);
    }
    case 'conditional': {
      if (!schema.discriminant.validate(value.discriminant)) {
        return false;
      }
      return clientSideValidateProp(
        schema.values[value.discriminant],
        value.value,
        undefined,
        path.concat('value')
      );
    }
    case 'object': {
      for (const [key, childProp] of Object.entries(schema.fields)) {
        if (
          !clientSideValidateProp(
            childProp,
            value[key],
            key === slugField?.field ? slugField : undefined,
            path.concat(key)
          )
        ) {
          return false;
        }
      }
      return true;
    }
    case 'array': {
      let slugInfo: undefined | { slugField: string; slugs: string[] };
      if (schema.slugField !== undefined && schema.element.kind === 'object') {
        const innerSchema = schema.element.fields;
        const { slugField } = schema;
        slugInfo = {
          slugField,
          slugs: (value as unknown[]).map(val =>
            getSlugFromState(
              { schema: innerSchema, slugField },
              val as Record<string, unknown>
            )
          ),
        };
      }
      for (const [idx, innerVal] of (value as unknown[]).entries()) {
        if (
          !clientSideValidateProp(
            schema.element,
            innerVal,
            slugInfo === undefined
              ? undefined
              : {
                  field: slugInfo.slugField,
                  slugs: new Set(slugInfo.slugs.filter((_, i) => idx !== i)),
                  glob: '*',
                },
            path.concat(idx)
          )
        ) {
          return false;
        }
      }
      return true;
    }
  }
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
  if (field?.kind === 'child') {
    return field.options.placeholder;
  }
  return '';
}
