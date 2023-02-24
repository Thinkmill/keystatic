import { assertNever } from 'emery';
import { isSlugFormField } from './app/utils';
import { ComponentSchema } from './DocumentEditor/component-blocks/api';
import { getInitialPropsValue } from './DocumentEditor/component-blocks/initial-values';
import { ReadonlyPropPath } from './DocumentEditor/component-blocks/utils';
import { Relationships } from './DocumentEditor/relationship';
import { isRelationshipData } from './structure-validation';

export class PropValidationError extends Error {
  path: ReadonlyPropPath;
  constructor(message: string, path: ReadonlyPropPath) {
    super(message);
    this.path = path;
  }
}

export function validateComponentBlockProps(
  schema: ComponentSchema,
  value: unknown,
  relationships: Relationships,
  path: ReadonlyPropPath,
  slugField:
    | {
        mode: 'state' | 'parse' | 'read';
        slug: string;
        field: string;
        slugs: Set<string>;
      }
    | undefined
): any {
  if (schema.kind === 'form') {
    if (path.length === 1 && slugField?.field === path[0]) {
      if (!isSlugFormField(schema)) {
        throw new Error('slugField is not a slug field');
      }
      const slugInfo = {
        currentSlug: slugField.slug,
        slugs: slugField.slugs,
      };
      if (slugField.mode === 'state') {
        if (!schema.validate(value, slugInfo)) {
          throw new PropValidationError('Invalid form prop value', path);
        }
        return value;
      }
      const parsed = schema.slug.parse({
        slug: slugField.slug,
        value,
      });
      if (!schema.validate(parsed, slugInfo)) {
        throw new PropValidationError('Invalid form prop value', path);
      }
      if (slugField.mode === 'read') {
        return schema.slug.serialize(parsed).value;
      }
      return parsed;
    }
    if ('serializeToFile' in schema && schema.serializeToFile) {
      return value;
    }
    if (schema.validate(value, undefined)) {
      return value;
    }
    throw new PropValidationError('Invalid form prop value', path);
  }
  if (schema.kind === 'child') {
    return null;
  }
  if (schema.kind === 'conditional') {
    if (typeof value !== 'object' || value === null) {
      throw new PropValidationError(
        'Conditional value must be an object',
        path
      );
    }
    for (const key of Object.keys(value)) {
      if (key !== 'discriminant' && key !== 'value') {
        throw new PropValidationError(
          `Conditional value only allows keys named "discriminant" and "value", not "${key}"`,
          path
        );
      }
    }
    const discriminant = (value as any).discriminant;
    const val = (value as any).value;
    // for some reason mongo or mongoose or something is saving undefined as null
    // so we're doing this so that we avoid setting undefined on objects
    const obj: any = {};
    const discriminantVal = validateComponentBlockProps(
      schema.discriminant,
      discriminant,
      relationships,
      path.concat('discriminant'),
      slugField
    );
    if (discriminantVal !== undefined) {
      obj.discriminant = discriminantVal;
    }
    const conditionalFieldValue = validateComponentBlockProps(
      schema.values[discriminant],
      val,
      relationships,
      path.concat('value'),
      slugField
    );
    if (conditionalFieldValue !== undefined) {
      obj.value = conditionalFieldValue;
    }
    return obj;
  }

  if (schema.kind === 'object') {
    if (typeof value !== 'object' || value === null) {
      throw new PropValidationError('Object value must be an object', path);
    }
    const allowedKeysSet = new Set(Object.keys(schema.fields));
    for (const key of Object.keys(value)) {
      if (!allowedKeysSet.has(key)) {
        throw new PropValidationError(
          `Key on object value "${key}" is not allowed`,
          path
        );
      }
    }
    let val: Record<string, any> = {};
    for (const key of Object.keys(schema.fields)) {
      let individualVal = (value as any)[key];
      if (individualVal === undefined) {
        individualVal = getInitialPropsValue(schema.fields[key]);
      }
      const propVal = validateComponentBlockProps(
        schema.fields[key],
        individualVal,
        relationships,
        path.concat(key),
        slugField
      );

      // for some reason mongo or mongoose or something is saving undefined as null
      // so we're doing this so that we avoid setting undefined on objects
      if (propVal !== undefined) {
        val[key] = propVal;
      }
    }
    return val;
  }
  if (schema.kind === 'array') {
    if (!Array.isArray(value)) {
      throw new PropValidationError('Array field value must be an array', path);
    }
    return value.map((innerVal, i) => {
      return validateComponentBlockProps(
        schema.element,
        innerVal,
        relationships,
        path.concat(i),
        slugField
      );
    });
  }
  assertNever(schema);
}
