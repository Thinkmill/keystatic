import { ReadonlyPropPath } from '../DocumentEditor/component-blocks/utils';
import { ArrayField, ChildField, ComponentSchema } from '../../../..';

export type PathToChildFieldWithOption =
  | {
      relativePath: ReadonlyPropPath;
      options: ChildField['options'];
      kind: 'child';
    }
  | {
      kind: 'array';
      field: ArrayField<any>;
      asChildTag: string;
      relativePath: ReadonlyPropPath;
      child: PathToChildFieldWithOption;
    };

class VariableChildFields extends Error {
  constructor() {
    super('There are a variable number of child fields');
  }
}

export function findSingleChildField(schema: ComponentSchema) {
  try {
    const result = _findConstantChildFields(schema, [], new Set());
    if (result.length === 1) {
      return result[0];
    }
    return;
  } catch (err) {
    if (err instanceof VariableChildFields) {
      return;
    }
    throw err;
  }
}

function _findConstantChildFields(
  schema: ComponentSchema,
  path: ReadonlyPropPath,
  seenSchemas: Set<ComponentSchema>
): PathToChildFieldWithOption[] {
  if (seenSchemas.has(schema)) {
    return [];
  }
  seenSchemas.add(schema);
  switch (schema.kind) {
    case 'form':
      return [];
    case 'child':
      return [{ relativePath: path, options: schema.options, kind: 'child' }];
    case 'conditional': {
      if (couldContainChildField(schema)) {
        throw new VariableChildFields();
      }
      return [];
    }
    case 'array': {
      if (schema.asChildTag) {
        const child = _findConstantChildFields(schema.element, [], seenSchemas);
        if (child.length > 1) {
          return [];
        }
        return [
          {
            kind: 'array',
            asChildTag: schema.asChildTag,
            field: schema,
            relativePath: path,
            child: child[0],
          },
        ];
      }
      if (couldContainChildField(schema)) {
        throw new VariableChildFields();
      }
      return [];
    }
    case 'object': {
      const paths: PathToChildFieldWithOption[] = [];
      for (const [key, value] of Object.entries(schema.fields)) {
        paths.push(
          ..._findConstantChildFields(value, path.concat(key), seenSchemas)
        );
      }
      return paths;
    }
  }
}

function couldContainChildField(
  schema: ComponentSchema,
  seen: Set<ComponentSchema> = new Set()
): boolean {
  if (seen.has(schema)) {
    return false;
  }
  seen.add(schema);
  switch (schema.kind) {
    case 'form':
      return false;
    case 'child':
      return true;
    case 'conditional':
      return Object.values(schema.values).some(value =>
        couldContainChildField(value, seen)
      );
    case 'object':
      return Object.keys(schema.fields).some(key =>
        couldContainChildField(schema.fields[key], seen)
      );
    case 'array':
      return couldContainChildField(schema.element, seen);
  }
}
