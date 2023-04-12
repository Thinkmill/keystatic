import { assertNever } from 'emery';

import { getSlugFromState } from '../../app/utils';
import { DocumentFeatures } from '../document-features';
import { DocumentFeaturesForNormalization } from '../document-features-normalization';
import { Mark } from '../utils';
import { ComponentSchema, ChildField } from './api';
import { SlugFieldInfo } from './fields/text/ui';
import { FieldDataError } from './fields/error';
import { PropValidationError } from '../../parse-props';

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

function flattenErrors(error: unknown): unknown[] {
  if (error instanceof AggregateError) {
    return error.errors.flatMap(flattenErrors);
  }
  return [error];
}

export function formatFormDataError(error: unknown) {
  const flatErrors = flattenErrors(error);

  return flatErrors
    .map(error => {
      if (error instanceof PropValidationError) {
        const path = error.path.join('.');
        return `${path}: ${
          error.cause instanceof FieldDataError
            ? error.cause.message
            : `Unexpected error: ${error.cause}`
        }`;
      }
      return `Unexpected error: ${error}`;
    })
    .join('\n');
}

export function toFormattedFormDataError(error: unknown) {
  const formatted = formatFormDataError(error);
  return new Error(`Field validation failed:\n` + formatted);
}

export function clientSideValidateProp(
  schema: ComponentSchema,
  value: any,
  slugField: SlugFieldInfo | undefined
) {
  try {
    validateValueWithSchema(schema, value, slugField);
    return true;
  } catch (error) {
    console.warn(toFormattedFormDataError(error));
    return false;
  }
}

export function validateValueWithSchema(
  schema: ComponentSchema,
  value: any,
  slugField: SlugFieldInfo | undefined,
  path: ReadonlyPropPath = []
): void {
  switch (schema.kind) {
    case 'child': {
      return;
    }
    case 'form': {
      try {
        if (slugField && path[path.length - 1] === slugField?.field) {
          schema.validate(value, {
            slugField: { slugs: slugField.slugs, glob: slugField.glob },
          });
          return;
        }
        schema.validate(value, undefined);
      } catch (err) {
        throw new PropValidationError(err, path, schema);
      }
      return;
    }
    case 'conditional': {
      schema.discriminant.validate(value.discriminant);
      validateValueWithSchema(
        schema.values[value.discriminant],
        value.value,
        undefined,
        path.concat('value')
      );
      return;
    }
    case 'object': {
      const errors: unknown[] = [];
      for (const [key, childProp] of Object.entries(schema.fields)) {
        try {
          validateValueWithSchema(
            childProp,
            value[key],
            key === slugField?.field ? slugField : undefined,
            path.concat(key)
          );
        } catch (err) {
          errors.push(err);
        }
      }
      if (errors.length > 0) {
        throw new AggregateError(errors);
      }
      return;
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
      const errors: unknown[] = [];

      for (const [idx, innerVal] of (value as unknown[]).entries()) {
        try {
          validateValueWithSchema(
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
          );
        } catch (err) {
          errors.push(err);
        }
      }
      if (errors.length > 0) {
        throw new AggregateError(errors);
      }
      return;
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
