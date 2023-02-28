import { DocumentFeatures } from '../document-features';
import { DocumentFeaturesForNormalization } from '../document-features-normalization';
import { assert, Mark } from '../utils';
import { ComponentSchema, ChildField, ValueForComponentSchema } from './api';
import { getKeysForArrayValue, setKeysForArrayValue } from './preview-props';

type PathToChildFieldWithOption = {
  path: ReadonlyPropPath;
  options: ChildField['options'];
};

export function findChildPropPathsForProp(
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

export function assertNever(arg: never): never {
  throw new Error(
    'expected to never be called but received: ' + JSON.stringify(arg)
  );
}

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
    },
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
  slugField:
    | { field: string; slugs: Set<string>; currentSlug: string | undefined }
    | undefined,
  path: ReadonlyPropPath = []
): boolean {
  switch (schema.kind) {
    case 'child': {
      return true;
    }
    case 'form': {
      if (path.length === 1 && path[0] === slugField?.field) {
        return schema.validate(value, {
          currentSlug: slugField.currentSlug,
          slugs: slugField.slugs,
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
        slugField,
        path.concat('value')
      );
    }
    case 'object': {
      for (const [key, childProp] of Object.entries(schema.fields)) {
        if (
          !clientSideValidateProp(
            childProp,
            value[key],
            slugField,
            path.concat(key)
          )
        ) {
          return false;
        }
      }
      return true;
    }
    case 'array': {
      for (const [idx, innerVal] of (value as unknown[]).entries()) {
        if (
          !clientSideValidateProp(
            schema.element,
            innerVal,
            slugField,
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

export function getValueAtPropPath(
  value: unknown,
  inputPath: ReadonlyPropPath
) {
  const path = [...inputPath];
  while (path.length) {
    const key = path.shift()!;
    value = (value as any)[key];
  }
  return value;
}

export function traverseProps(
  schema: ComponentSchema,
  value: unknown,
  visitor: (
    schema: ComponentSchema,
    value: unknown,
    path: ReadonlyPropPath
  ) => void,
  path: ReadonlyPropPath = []
) {
  if (schema.kind === 'form' || schema.kind === 'child') {
    visitor(schema, value, path);
    return;
  }
  if (schema.kind === 'object') {
    for (const [key, childProp] of Object.entries(schema.fields)) {
      traverseProps(childProp, (value as any)[key], visitor, [...path, key]);
    }
    visitor(schema, value, path);
    return;
  }
  if (schema.kind === 'array') {
    for (const [idx, val] of (value as unknown[]).entries()) {
      traverseProps(schema.element, val, visitor, path.concat(idx));
    }
    return visitor(schema, value, path);
  }
  if (schema.kind === 'conditional') {
    const discriminant: string | boolean = (value as any).discriminant;
    visitor(schema, discriminant, path.concat('discriminant'));
    traverseProps(
      schema.values[discriminant.toString()],
      (value as any).value,
      visitor,
      path.concat('value')
    );
    visitor(schema, value, path);
    return;
  }
  assertNever(schema);
}

export function transformProps(
  schema: ComponentSchema,
  value: unknown,
  visitors: {
    [Kind in ComponentSchema['kind']]?: (
      schema: Extract<ComponentSchema, { kind: Kind }>,
      value: ValueForComponentSchema<Extract<ComponentSchema, { kind: Kind }>>,
      path: ReadonlyPropPath
    ) => ValueForComponentSchema<Extract<ComponentSchema, { kind: Kind }>>;
  },
  path: ReadonlyPropPath = []
): unknown {
  if (schema.kind === 'form' || schema.kind === 'child') {
    if (visitors[schema.kind]) {
      return (visitors[schema.kind] as any)(schema, value, path);
    }
    return value;
  }
  if (schema.kind === 'object') {
    const val = Object.fromEntries(
      Object.entries(schema.fields).map(([key, val]) => {
        return [
          key,
          transformProps(val, (value as any)[key], visitors, [...path, key]),
        ];
      })
    );
    if (visitors.object) {
      return (visitors[schema.kind] as any)(schema, val, path);
    }
    return val;
  }
  if (schema.kind === 'array') {
    const val = (value as unknown[]).map((val, idx) =>
      transformProps(schema.element, val, visitors, path.concat(idx))
    );
    if (visitors.array) {
      return (visitors[schema.kind] as any)(schema, val, path);
    }
    return val;
  }
  if (schema.kind === 'conditional') {
    const discriminant = transformProps(
      schema.discriminant,
      (value as any).discriminant,
      visitors,
      path.concat('discriminant')
    ) as string | boolean;
    const conditionalVal = transformProps(
      schema.values[discriminant.toString()],
      (value as any).value,
      visitors,
      path.concat('value')
    );

    const val = {
      discriminant,
      value: conditionalVal,
    };
    if (visitors.conditional) {
      return (visitors[schema.kind] as any)(schema, val, path);
    }
    return val;
  }
  assertNever(schema);
}

export async function asyncTransformProps(
  schema: ComponentSchema,
  value: unknown,
  visitors: {
    [Kind in ComponentSchema['kind']]?: (
      schema: Extract<ComponentSchema, { kind: Kind }>,
      value: ValueForComponentSchema<Extract<ComponentSchema, { kind: Kind }>>,
      path: ReadonlyPropPath
    ) => Promise<
      ValueForComponentSchema<Extract<ComponentSchema, { kind: Kind }>>
    >;
  },
  path: ReadonlyPropPath = []
): Promise<unknown> {
  if (schema.kind === 'form' || schema.kind === 'child') {
    if (visitors[schema.kind]) {
      return (visitors[schema.kind] as any)(schema, value, path);
    }
    return value;
  }
  if (schema.kind === 'object') {
    const val = Object.fromEntries(
      await Promise.all(
        Object.entries(schema.fields).map(async ([key, val]) => {
          return [
            key,
            await asyncTransformProps(val, (value as any)[key], visitors, [
              ...path,
              key,
            ]),
          ];
        })
      )
    );
    if (visitors.object) {
      return (visitors[schema.kind] as any)(schema, val, path);
    }
    return val;
  }
  if (schema.kind === 'array') {
    const val = await Promise.all(
      (value as unknown[]).map((val, idx) =>
        asyncTransformProps(schema.element, val, visitors, path.concat(idx))
      )
    );
    if (visitors.array) {
      return (visitors[schema.kind] as any)(schema, val, path);
    }
    return val;
  }
  if (schema.kind === 'conditional') {
    const discriminant = (await asyncTransformProps(
      schema.discriminant,
      (value as any).discriminant,
      visitors,
      path.concat('discriminant')
    )) as string | boolean;
    const conditionalVal = await asyncTransformProps(
      schema.values[discriminant.toString()],
      (value as any).value,
      visitors,
      path.concat('value')
    );

    const val = {
      discriminant,
      value: conditionalVal,
    };
    if (visitors.conditional) {
      return (visitors[schema.kind] as any)(schema, val, path);
    }
    return val;
  }
  assertNever(schema);
}

export function replaceValueAtPropPath(
  schema: ComponentSchema,
  value: unknown,
  newValue: unknown,
  path: ReadonlyPropPath
): unknown {
  if (path.length === 0) {
    return newValue;
  }

  const [key, ...newPath] = path;

  if (schema.kind === 'object') {
    return {
      ...(value as any),
      [key]: replaceValueAtPropPath(
        schema.fields[key],
        (value as any)[key],
        newValue,
        newPath
      ),
    };
  }

  if (schema.kind === 'conditional') {
    const conditionalValue = value as {
      discriminant: string | boolean;
      value: unknown;
    };
    // replaceValueAtPropPath should not be used to only update the discriminant of a conditional field
    // if you want to update the discriminant of a conditional field, replace the value of the whole conditional field
    assert(key === 'value');
    return {
      discriminant: conditionalValue.discriminant,
      value: replaceValueAtPropPath(
        schema.values[key],
        conditionalValue.value,
        newValue,
        newPath
      ),
    };
  }

  if (schema.kind === 'array') {
    const prevVal = value as unknown[];
    const newVal = [...prevVal];
    setKeysForArrayValue(newVal, getKeysForArrayValue(prevVal));
    newVal[key as number] = replaceValueAtPropPath(
      schema.element,
      newVal[key as number],
      newValue,
      newPath
    );
    return newVal;
  }

  // we should never reach here since form or child fields don't contain other fields
  // so the only thing that can happen to them is to be replaced which happens at the start of this function when path.length === 0
  assert(schema.kind !== 'form' && schema.kind !== 'child');

  assertNever(schema);
}

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
