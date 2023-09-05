import { getSlugFromState } from '../app/utils';
import { ComponentSchema } from './api';
import { SlugFieldInfo } from './fields/text/path-slug-context';
import { PropValidationError } from './parse-props';
import { ReadonlyPropPath } from './fields/document/DocumentEditor/component-blocks/utils';
import { validateArrayLength } from './validate-array-length';
import { toFormattedFormDataError } from './error-formatting';

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
