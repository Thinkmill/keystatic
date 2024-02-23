import { assertNever } from 'emery';
import { ComponentSchema } from './api';
import { ReadonlyPropPath } from './fields/document/DocumentEditor/component-blocks/utils';
import { FormField, FormFieldStoredValue, JsonYamlValue } from '..';
import { FieldDataError } from './fields/error';
import { validateArrayLength } from './validate-array-length';
import { getInitialPropsValue } from './initial-values';

export class PropValidationError extends Error {
  path: ReadonlyPropPath;
  schema: ComponentSchema;
  cause: unknown;
  constructor(cause: unknown, path: ReadonlyPropPath, schema: ComponentSchema) {
    super(`field error at ${path.join('.')}`, { cause });
    this.path = path;
    this.schema = schema;
    this.cause = cause;
  }
}

function toFormFieldStoredValue(
  val: JsonYamlValue | undefined
): FormFieldStoredValue {
  if (val === null) {
    return undefined;
  }
  return val;
}

const isArray: (val: unknown) => val is readonly unknown[] = Array.isArray;

export function parseProps(
  schema: ComponentSchema,
  _value: JsonYamlValue | undefined,
  path: ReadonlyPropPath,
  pathWithArrayFieldSlugs: readonly string[],
  parseFormField: (
    schema: FormField<any, any, any>,
    value: FormFieldStoredValue,
    path: ReadonlyPropPath,
    pathWithArrayFieldSlugs: readonly string[]
  ) => any,
  /** This should be true for the reader and false elsewhere */
  validateArrayFieldLength: boolean
): any {
  let value = toFormFieldStoredValue(_value);
  if (schema.kind === 'form') {
    try {
      return parseFormField(schema, value, path, pathWithArrayFieldSlugs);
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }
  }
  if (schema.kind === 'child') {
    return null;
  }
  if (schema.kind === 'conditional') {
    if (value === undefined) {
      return getInitialPropsValue(schema);
    }
    try {
      if (
        typeof value !== 'object' ||
        value === null ||
        isArray(value) ||
        value instanceof Date
      ) {
        throw new FieldDataError('Must be an object');
      }
      for (const key of Object.keys(value)) {
        if (key !== 'discriminant' && key !== 'value') {
          throw new FieldDataError(
            `Must only contain keys "discriminant" and "value", not "${key}"`
          );
        }
      }
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }

    const parsedDiscriminant = parseProps(
      schema.discriminant,
      value.discriminant,
      path.concat('discriminant'),
      pathWithArrayFieldSlugs.concat('discriminant'),
      parseFormField,
      validateArrayFieldLength
    );

    return {
      discriminant: parsedDiscriminant,
      value: parseProps(
        schema.values[parsedDiscriminant],
        value.value,
        path.concat('value'),
        pathWithArrayFieldSlugs.concat('value'),
        parseFormField,
        validateArrayFieldLength
      ),
    };
  }

  if (schema.kind === 'object') {
    if (value === undefined) {
      value = {};
    }
    try {
      if (
        typeof value !== 'object' ||
        value === null ||
        isArray(value) ||
        value instanceof Date
      ) {
        throw new FieldDataError('Must be an object');
      }
      const allowedKeysSet = new Set(Object.keys(schema.fields));
      for (const key of Object.keys(value)) {
        if (!allowedKeysSet.has(key)) {
          throw new FieldDataError(
            `Key on object value "${key}" is not allowed`
          );
        }
      }
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }
    const val: Record<string, any> = {};
    const errors: unknown[] = [];
    for (const key of Object.keys(schema.fields)) {
      let individualVal = value[key];
      try {
        const propVal = parseProps(
          schema.fields[key],
          individualVal,
          path.concat(key),
          pathWithArrayFieldSlugs.concat(key),
          parseFormField,
          validateArrayFieldLength
        );
        val[key] = propVal;
      } catch (err) {
        errors.push(err);
      }
    }
    if (errors.length) {
      throw new AggregateError(errors);
    }
    return val;
  }
  if (schema.kind === 'array') {
    if (value === undefined) {
      return [];
    }
    try {
      if (!isArray(value)) {
        throw new FieldDataError('Must be an array');
      }
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }
    const errors: unknown[] = [];
    try {
      if (validateArrayFieldLength) {
        const error = validateArrayLength(schema, value, path);
        if (error !== undefined) {
          errors.push(error);
        }
      }
      return value.map((innerVal, i) => {
        try {
          let slug = i.toString();
          if (
            schema.slugField &&
            typeof innerVal === 'object' &&
            innerVal !== null &&
            !isArray(innerVal) &&
            !(innerVal instanceof Date)
          ) {
            if (schema.element.kind !== 'object') {
              throw new Error(
                'slugField on array fields requires the an object field element'
              );
            }
            const slugField = schema.element.fields[schema.slugField];
            if (!slugField) {
              throw new Error(
                `slugField "${schema.slugField}" does not exist on object field`
              );
            }
            if (slugField.kind !== 'form') {
              throw new Error(
                `slugField "${schema.slugField}" is not a form field`
              );
            }
            if (slugField.formKind !== 'slug') {
              throw new Error(
                `slugField "${schema.slugField}" is not a slug field`
              );
            }

            let parsedSlugFieldValue;
            try {
              parsedSlugFieldValue = slugField.parse(
                toFormFieldStoredValue(innerVal[schema.slugField]),
                undefined
              );
            } catch (err) {
              throw new AggregateError([err]);
            }
            slug = slugField.serializeWithSlug(parsedSlugFieldValue).slug;
          }
          return parseProps(
            schema.element,
            innerVal,
            path.concat(i),
            pathWithArrayFieldSlugs.concat(slug),
            parseFormField,
            validateArrayFieldLength
          );
        } catch (err) {
          errors.push(err);
        }
      });
    } finally {
      if (errors.length) {
        throw new AggregateError(errors);
      }
    }
  }
  assertNever(schema);
}
