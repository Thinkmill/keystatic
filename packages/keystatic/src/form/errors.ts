import { getSlugFromState } from '../app/utils';
import { ComponentSchema, ObjectField } from './api';
import { SlugFieldInfo } from './fields/text/path-slug-context';
import { PropValidationError } from './prop-validation-error';
import { ReadonlyPropPath } from './fields/document/DocumentEditor/component-blocks/utils';
import { validateArrayLength } from './validate-array-length';
import { toFormattedFormDataError } from './error-formatting';

type ValidationSlugFieldInfo = SlugFieldInfo & { prefix?: string };

function slugSegmentFromState(schema: ComponentSchema, value: unknown): string {
  if (value === undefined || value === null) return '';
  if (schema.kind === 'form' && schema.formKind === 'slug') {
    return schema.serializeWithSlug(value).slug;
  }
  return '';
}

function slugFieldInfoForChild(
  schema: ObjectField<Record<string, ComponentSchema>>,
  value: any,
  key: string,
  slugField: ValidationSlugFieldInfo | undefined,
  atRoot: boolean
): ValidationSlugFieldInfo | undefined {
  if (!slugField) {
    return undefined;
  }
  if (!atRoot || slugField.fields.length === 1) {
    return key === slugField.field ? slugField : undefined;
  }
  // for a multi-slug collection, the last slug field is validated for
  // uniqueness against the composite slug built from the other segments
  if (key === slugField.field) {
    const prefix = slugField.fields
      .slice(0, -1)
      .map(f => slugSegmentFromState(schema.fields[f], value?.[f]))
      .join('/');
    return { ...slugField, prefix };
  }
  if (slugField.fields.includes(key)) {
    // secondary slug fields only get format validation, their uniqueness is
    // enforced via the composite slug on the last slug field
    return { ...slugField, slugs: new Set(), prefix: undefined };
  }
  return undefined;
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

function validateValueWithSchema(
  schema: ComponentSchema,
  value: any,
  slugField: ValidationSlugFieldInfo | undefined,
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
            slugField: {
              slugs: slugField.slugs,
              glob: slugField.glob,
              prefix: slugField.prefix,
            },
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
            slugFieldInfoForChild(schema, value, key, slugField, !path.length),
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
      const val = value as unknown[];
      const error = validateArrayLength(schema, value, path);
      if (error !== undefined) {
        errors.push(error);
      }
      for (const [idx, innerVal] of val.entries()) {
        try {
          validateValueWithSchema(
            schema.element,
            innerVal,
            slugInfo === undefined
              ? undefined
              : {
                  field: slugInfo.slugField,
                  fields: [slugInfo.slugField],
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
