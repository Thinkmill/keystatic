import {
  ArrayField,
  ConditionalField,
  ParsedValueForComponentSchema,
  ObjectField,
  GenericPreviewProps,
  BasicFormField,
  FormField,
} from './api';
import * as Y from 'yjs';
import { parsedValToYjs, yjsToVal } from './props-value';
import { ReactElement } from 'react';
import { Awareness } from 'y-protocols/awareness';

export type ComponentSchemaWithoutChildField =
  | FormField<any, any, any>
  | ObjectField<{ [key: string]: ComponentSchemaWithoutChildField }>
  | ConditionalField<
      BasicFormField<any, any, any>,
      { [key: string]: ComponentSchemaWithoutChildField }
    >
  | ArrayFieldInComponentSchema;

// this is written like this rather than ArrayField<ComponentSchema> to avoid TypeScript erroring about circularity
type ArrayFieldInComponentSchema = {
  kind: 'array';
  element: ComponentSchemaWithoutChildField;
  label: string;
  description?: string;
  // this is written with unknown to avoid typescript being annoying about circularity or variance things
  itemLabel?(props: unknown): string;
  asChildTag?: string;
  slugField?: string;
  validation?: {
    length?: {
      min?: number;
      max?: number;
    };
  };
  Input?(props: unknown): ReactElement | null;
};

const arrayValuesToElementKeys = new WeakMap<
  readonly unknown[],
  readonly string[]
>();

let counter = 0;

export function getKeysForArrayValue(value: readonly unknown[]) {
  if (!arrayValuesToElementKeys.has(value)) {
    if (value === undefined) {
      debugger;
    }
    arrayValuesToElementKeys.set(
      value,
      Array.from({ length: value.length }, getNewArrayElementKey)
    );
  }
  return arrayValuesToElementKeys.get(value)!;
}

export function setKeysForArrayValue(
  value: readonly unknown[],
  elementIds: readonly string[]
) {
  arrayValuesToElementKeys.set(value, elementIds);
}

export function getNewArrayElementKey() {
  return (counter++).toString();
}

function castToMemoizedInfoForSchema<
  T extends {
    [Kind in ComponentSchemaWithoutChildField['kind']]: (
      schema: Extract<ComponentSchemaWithoutChildField, { kind: Kind }>,
      stateUpdater: StateUpdater<
        ComponentSchemaWithoutChildField & { kind: Kind }
      >
    ) => unknown;
  },
>(val: T): T {
  return val;
}

type GeneralMap<K, V> = {
  has(key: K): boolean;
  get(key: K): V | undefined;
  set(key: K, value: V): void;
};

function getOrInsert<K, V>(
  map: GeneralMap<K, V>,
  key: K,
  val: (key: K) => V
): V {
  if (!map.has(key)) {
    map.set(key, val(key));
  }
  return map.get(key)!;
}

export function createGetPreviewPropsFromY<
  Schema extends ObjectField<Record<string, ComponentSchemaWithoutChildField>>,
>(
  rootSchema: Schema,
  yMap: Y.Map<unknown>,
  awareness: Awareness
): (
  value: ParsedValueForComponentSchema<Schema>
) => GenericPreviewProps<Schema, undefined> {
  const memoizedInfoForSchema = castToMemoizedInfoForSchema({
    form(schema, onChange) {
      return onChange;
    },
    array(schema, onChange) {
      return {
        rawOnChange: onChange,
        inner: new Map<
          string,
          {
            onChange: StateUpdater<ComponentSchemaWithoutChildField>;
            elementWithKey: { key: string } & GenericPreviewProps<
              ComponentSchemaWithoutChildField,
              undefined
            >;
            element: GenericPreviewProps<
              ComponentSchemaWithoutChildField,
              undefined
            >;
          }
        >(),
        onChange(
          updater: readonly { key: string | undefined; value?: unknown }[]
        ) {
          const oldKeys = getKeysForArrayValue(
            yjsToVal(schema, awareness, yMap) as readonly unknown[]
          );
          const newValue = [
            ...(yjsToVal(schema, awareness, yMap) as readonly unknown[]),
          ];
          for (const { key, value } of updater) {
            if (key === undefined) {
              newValue.push(value);
            } else {
              const index = oldKeys.indexOf(key);
              if (value === undefined) {
                newValue.splice(index, 1);
              } else {
                newValue[index] = value;
              }
            }
          }
          onChange(() => newValue);
        },
      };
    },
    conditional(schema, stateUpdater) {
      return {
        onChange: (discriminant: string | boolean, value?: unknown) => {
          stateUpdater.yjs().set('discriminant', discriminant);
          if (value !== undefined) {
            stateUpdater.yjs().set('value', value);
          }
        },
        onChangeForValue: Object.assign(
          (cb: (prevVal: unknown) => unknown) => {
            const old = yjsToVal(
              schema,
              awareness,
              stateUpdater.yjs().get('value')
            );
            stateUpdater.yjs().set('value', parsedValToYjs(schema, cb(old)));
          },
          {
            yjs() {
              return stateUpdater.yjs().get('value');
            },
          }
        ),
      };
    },
    object(schema, stateUpdater) {
      return {
        onChange: (updater: Record<string, unknown>) => {
          for (const [key, val] of Object.entries(updater)) {
            stateUpdater
              .yjs()
              .set(key, parsedValToYjs(schema.fields[key], val));
          }
        },
        innerOnChanges: Object.fromEntries(
          Object.entries(schema.fields).map(([key, val]) => {
            let func = Object.assign(
              (newVal: unknown) => {
                if (typeof stateUpdater.yjs !== 'function') {
                  debugger;
                }
                stateUpdater.yjs().set(key, parsedValToYjs(val, newVal));
              },
              {
                yjs() {
                  return stateUpdater.yjs().get(key);
                },
              }
            );
            return [key, func];
          })
        ),
      };
    },
  });

  const previewPropsFactories: {
    [Kind in ComponentSchemaWithoutChildField['kind']]: (
      schema: Extract<ComponentSchemaWithoutChildField, { kind: Kind }>,
      value: ParsedValueForComponentSchema<
        Extract<ComponentSchemaWithoutChildField, { kind: Kind }>
      >,
      memoized: ReturnType<(typeof memoizedInfoForSchema)[Kind]>,
      path: readonly string[],
      getInnerProp: <Field extends ComponentSchemaWithoutChildField>(
        schema: Field,
        value: ParsedValueForComponentSchema<Field>,
        onChange: StateUpdater<Field>,
        key: string
      ) => GenericPreviewProps<Field, undefined>
    ) => GenericPreviewProps<
      Extract<ComponentSchemaWithoutChildField, { kind: Kind }>,
      undefined
    >;
  } = {
    form(schema, value, onChange) {
      return {
        value,
        onChange,
        schema: schema as any,
      };
    },
    object(schema, value, memoized, path, getInnerProp) {
      const fields: Record<
        string,
        GenericPreviewProps<ComponentSchemaWithoutChildField, undefined>
      > = {};

      for (const key of Object.keys(schema.fields)) {
        fields[key] = getInnerProp(
          schema.fields[key],
          value[key],
          memoized.innerOnChanges[key] as any,
          key
        );
      }

      const previewProps: GenericPreviewProps<
        ObjectField<Record<string, ComponentSchemaWithoutChildField>>,
        undefined
      > = {
        fields,
        onChange: memoized.onChange,
        schema: schema,
      };
      return previewProps;
    },
    array(schema, value, memoized, path, getInnerProp) {
      const arrayValue = value as readonly unknown[];
      const keys = getKeysForArrayValue(arrayValue);

      const unusedKeys = new Set(getKeysForArrayValue(value));

      const props: GenericPreviewProps<
        ArrayField<ComponentSchemaWithoutChildField>,
        undefined
      > = {
        elements: arrayValue.map((val, i) => {
          const key = keys[i];
          unusedKeys.delete(key);
          const element = getOrInsert(memoized.inner, key, () => {
            const onChange = Object.assign(
              (val: (val: unknown) => unknown) => {
                memoized.rawOnChange(prev => {
                  const keys = getKeysForArrayValue(prev as readonly unknown[]);
                  const index = keys.indexOf(key);
                  const newValue = [...(prev as readonly unknown[])];
                  newValue[index] = val(newValue[index]);
                  setKeysForArrayValue(newValue, keys);
                  return newValue;
                });
              },
              {
                yjs() {
                  // TODO: this i is wrong
                  return memoized.rawOnChange.yjs().get(i);
                },
              }
            );
            const element = getInnerProp(schema.element, val, onChange, key);
            return {
              element,
              elementWithKey: {
                ...element,
                key,
              },
              onChange,
            };
          });
          const currentInnerProp = getInnerProp(
            schema.element,
            val,
            element.onChange,
            key
          );
          if (element.element !== currentInnerProp) {
            element.element = currentInnerProp;
            element.elementWithKey = {
              ...currentInnerProp,
              key,
            };
          }
          return element.elementWithKey;
        }),
        schema: schema,
        onChange: memoized.onChange,
      };
      for (const key of unusedKeys) {
        memoized.inner.delete(key);
      }
      return props;
    },
    conditional(schema, value, memoized, path, getInnerProp) {
      const props: GenericPreviewProps<
        ConditionalField<
          BasicFormField<string | boolean>,
          { [key: string]: ComponentSchemaWithoutChildField }
        >,
        undefined
      > = {
        discriminant: value.discriminant as any,
        onChange: memoized.onChange,
        value: getInnerProp(
          schema.values[value.discriminant.toString()],
          value.value,
          memoized.onChangeForValue,
          'value'
        ),
        schema: schema,
      };
      return props;
    },
  };

  function getPreviewPropsForProp<
    Schema extends ComponentSchemaWithoutChildField,
  >(
    schema: Schema,
    value: unknown,
    memoedThing: { __memoizedThing: true },
    path: readonly string[],
    getInnerProp: <Field extends ComponentSchemaWithoutChildField>(
      schema: Field,
      value: ParsedValueForComponentSchema<Field>,
      stateUpdater: StateUpdater<Field>,
      key: string
    ) => GenericPreviewProps<Field, undefined>
  ): GenericPreviewProps<Schema, undefined> {
    return previewPropsFactories[schema.kind](
      schema as any,
      value,
      memoedThing as any,
      path,
      getInnerProp
    ) as any;
  }

  function getInitialMemoState<Schema extends ComponentSchemaWithoutChildField>(
    schema: Schema,
    value: ParsedValueForComponentSchema<Schema>,
    stateUpdater: StateUpdater<Schema>,
    path: readonly string[]
  ): MemoState<Schema> {
    const innerState = new Map<
      string,
      MemoState<ComponentSchemaWithoutChildField>
    >();
    const memoizedInfo = (
      memoizedInfoForSchema[schema.kind] as (
        schema: ComponentSchemaWithoutChildField,
        stateUpdater: StateUpdater<Schema>
      ) => any
    )(schema, stateUpdater);
    const state: MemoState<ComponentSchemaWithoutChildField> = {
      value,
      inner: innerState,
      props: getPreviewPropsForProp(
        schema,
        value,
        memoizedInfo,
        path,
        (schema, value, onChange, key) => {
          const state = getInitialMemoState(
            schema,
            value,
            onChange,
            path.concat(key)
          );
          innerState.set(key, state);
          return state.props;
        }
      ),
      schema: schema,
      cached: memoizedInfo,
    };
    return state as MemoState<Schema>;
  }
  function getUpToDateProps<Schema extends ComponentSchemaWithoutChildField>(
    schema: Schema,
    value: ParsedValueForComponentSchema<Schema>,
    stateUpdater: StateUpdater<Schema>,
    memoState: MemoState<Schema>,
    path: readonly string[]
  ): GenericPreviewProps<Schema, undefined> {
    if (memoState.schema !== schema) {
      Object.assign(
        memoState,
        getInitialMemoState(schema, value, stateUpdater, path)
      );
      return memoState.props;
    }
    if (memoState.value === value) {
      return memoState.props;
    }
    memoState.value = value;
    const unusedKeys = new Set(memoState.inner.keys());
    memoState.props = getPreviewPropsForProp(
      schema,
      value,
      memoState.cached as any,
      path,
      (schema, value, onChange, innerMemoStateKey) => {
        unusedKeys.delete(innerMemoStateKey);
        if (!memoState.inner.has(innerMemoStateKey)) {
          const innerState = getInitialMemoState(
            schema,
            value,
            onChange,
            path.concat(innerMemoStateKey)
          );
          memoState.inner.set(innerMemoStateKey, innerState);
          return innerState.props;
        }
        return getUpToDateProps<typeof schema>(
          schema,
          value,
          onChange,
          memoState.inner.get(innerMemoStateKey) as MemoState<typeof schema>,
          path.concat(innerMemoStateKey)
        );
      }
    );
    for (const key of unusedKeys) {
      memoState.inner.delete(key);
    }
    return memoState.props;
  }

  type MemoState<Schema extends ComponentSchemaWithoutChildField> = {
    props: GenericPreviewProps<Schema, undefined>;
    value: unknown;
    schema: Schema;
    cached: ReturnType<(typeof memoizedInfoForSchema)[Schema['kind']]>;
    inner: Map<string, MemoState<ComponentSchemaWithoutChildField>>;
  };

  let memoState: MemoState<Schema>;

  const rootUpdater: StateUpdater<Schema> = Object.assign(
    (cb: Parameters<StateUpdater<Schema>>[0]) => {
      const newValue = cb(memoState.value as any);
      const innerYMap = parsedValToYjs(rootSchema, newValue) as Y.Map<unknown>;
      for (const [key, val] of innerYMap.entries()) {
        innerYMap.delete(key);
        yMap.set(key, val);
      }
    },
    {
      yjs() {
        return yMap;
      },
    }
  ) as any;

  return (
    value: ParsedValueForComponentSchema<Schema>
  ): GenericPreviewProps<Schema, undefined> => {
    if (memoState === undefined) {
      memoState = getInitialMemoState(rootSchema, value, rootUpdater, []);
      return memoState.props;
    }
    return getUpToDateProps(rootSchema, value, rootUpdater, memoState, []);
  };
}

type StateUpdater<Schema extends ComponentSchemaWithoutChildField> = ((
  cb: (
    val: ParsedValueForComponentSchema<Schema>
  ) => ParsedValueForComponentSchema<Schema>
) => void) & {
  yjs(): {
    object: Y.Map<unknown>;
    array: Y.Array<unknown>;
    conditional: Y.Map<unknown>;
    form: unknown;
  }[Schema['kind']];
};
