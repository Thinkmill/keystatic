import { ComponentSchema, ChildField } from '../../../../api';
import { ReadonlyPropPath } from './utils';

type PathToChildFieldWithOption = {
  path: ReadonlyPropPath;
  options: ChildField['options'];
};

function findChildPropPathsForProp(
  value: any,
  schema: ComponentSchema,
  path: ReadonlyPropPath
): PathToChildFieldWithOption[] {
  switch (schema.kind) {
    case 'form':
      return [];
    case 'child':
      return [{ path: path, options: schema.options }];
    case 'conditional':
      return findChildPropPathsForProp(
        value.value,
        schema.values[value.discriminant],
        path.concat('value')
      );
    case 'object': {
      const paths: PathToChildFieldWithOption[] = [];
      Object.keys(schema.fields).forEach(key => {
        paths.push(
          ...findChildPropPathsForProp(
            value[key],
            schema.fields[key],
            path.concat(key)
          )
        );
      });
      return paths;
    }
    case 'array': {
      const paths: PathToChildFieldWithOption[] = [];
      (value as any[]).forEach((val, i) => {
        paths.push(
          ...findChildPropPathsForProp(val, schema.element, path.concat(i))
        );
      });
      return paths;
    }
  }
}
export function findChildPropPaths(
  value: Record<string, any>,
  props: Record<string, ComponentSchema>
): { path: ReadonlyPropPath | undefined; options: ChildField['options'] }[] {
  const propPaths = findChildPropPathsForProp(
    value,
    { kind: 'object', fields: props },
    []
  );
  if (!propPaths.length) {
    return [
      {
        path: undefined,
        options: { kind: 'inline', placeholder: '' },
      },
    ];
  }
  return propPaths;
}
