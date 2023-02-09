import { assertNever } from 'emery';
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
  path: ReadonlyPropPath
): any {
  if (schema.kind === 'form') {
    if ('serializeToFile' in schema && schema.serializeToFile) {
      return value;
    }
    if (schema.validate(value)) {
      return value;
    }
    throw new PropValidationError('Invalid form prop value', path);
  }
  if (schema.kind === 'child') {
    return null;
  }
  if (schema.kind === 'relationship') {
    if (schema.many) {
      if (Array.isArray(value) && value.every(isRelationshipData)) {
        // yes, ts understands this completely correctly, i'm as suprised as you are
        return value.map(x => ({ id: x.id }));
      } else {
        throw new PropValidationError(`Invalid relationship value`, path);
      }
    }
    if (value === null || isRelationshipData(value)) {
      return value === null ? null : { id: value.id };
    } else {
      throw new PropValidationError(`Invalid relationship value`, path);
    }
  }

  if (schema.kind === 'conditional') {
    if (typeof value !== 'object' || value === null) {
      throw new PropValidationError('Conditional value must be an object', path);
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
      path.concat('discriminant')
    );
    if (discriminantVal !== undefined) {
      obj.discriminant = discriminantVal;
    }
    const conditionalFieldValue = validateComponentBlockProps(
      schema.values[discriminant],
      val,
      relationships,
      path.concat('value')
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
        throw new PropValidationError(`Key on object value "${key}" is not allowed`, path);
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
        path.concat(key)
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
      return validateComponentBlockProps(schema.element, innerVal, relationships, path.concat(i));
    });
  }
  assertNever(schema);
}
