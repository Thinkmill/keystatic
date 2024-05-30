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
import { parsedValToYjs, yjsToVal } from './yjs-props-value';
import { ReactElement } from 'react';
import { Awareness } from 'y-protocols/awareness';
import {
  getInitialPropsValueFromInitializer,
  getKeysForArrayValue,
  getNewArrayElementKey,
  setKeysForArrayValue,
  updateValue,
} from './initial-values';

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

function findSingleReorderedElement(
  oldKeys: readonly string[],
  newKeys: readonly string[]
) {
  if (oldKeys.length !== newKeys.length) return;
  const sortedOldKeys = [...oldKeys].sort();
  const sortedNewKeys = [...newKeys].sort();
  if (sortedOldKeys.join() !== sortedNewKeys.join()) return;
  let reorderedKey;
  for (let i = 0; i < oldKeys.length; i++) {
    if (oldKeys[i] !== newKeys[i]) {
      if (reorderedKey === newKeys[i]) continue;
      if (reorderedKey !== undefined) return;
      reorderedKey = oldKeys[i];
    }
  }
  return reorderedKey;
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
          const yArr = onChange.yjs();
          const oldVal = yjsToVal(
            schema,
            awareness,
            yArr
          ) as readonly unknown[];
          const oldKeys = getKeysForArrayValue(yArr);

          const uniqueKeys = new Set();
          for (const x of updater) {
            if (x.key !== undefined) {
              if (uniqueKeys.has(x.key)) {
                throw new Error('Array elements must have unique keys');
              }
              uniqueKeys.add(x.key);
            }
          }
          const newKeys = updater.map(x => {
            if (x.key !== undefined) return x.key;
            let elementKey = getNewArrayElementKey();
            // just in case someone gives a key that is above our counter
            while (uniqueKeys.has(elementKey)) {
              elementKey = getNewArrayElementKey();
            }
            uniqueKeys.add(elementKey);
            return elementKey;
          });
          setKeysForArrayValue(yArr, newKeys);
          // optimise for the case where a single element has been re-ordered (drag and drop)
          const reorderedKey = findSingleReorderedElement(oldKeys, newKeys);
          if (reorderedKey !== undefined) {
            const oldIndex = oldKeys.indexOf(reorderedKey);
            const newIndex = newKeys.indexOf(reorderedKey);
            let val = yArr.get(oldIndex);
            if (val instanceof Y.AbstractType) {
              val = val.clone();
            }
            yArr.delete(oldIndex);
            yArr.insert(newIndex, [val]);
            for (const [idx, { value }] of updater.entries()) {
              const oldIndex = oldKeys.indexOf(newKeys[idx]);
              const newVal = updateValue(
                schema.element,
                oldVal[oldIndex],
                value
              );
              if (newVal !== oldVal) {
                yArr.delete(oldIndex);
                yArr.insert(idx, [parsedValToYjs(schema.element, newVal)]);
              }
            }
            return;
          }

          // optimise only updating values + added new elements at the end
          const oldKeysJoined = oldKeys.join();
          const newKeysJoined = newKeys.slice(0, oldKeys.length).join();

          if (oldKeysJoined === newKeysJoined) {
            for (const [idx, { value }] of updater.entries()) {
              const oldIndex = oldKeys.indexOf(newKeys[idx]);
              const newVal = updateValue(
                schema.element,
                oldVal[oldIndex],
                value
              );
              if (newVal !== oldVal) {
                yArr.delete(oldIndex);
                yArr.insert(idx, [parsedValToYjs(schema.element, newVal)]);
              }
            }
            const valsToInsert: unknown[] = [];
            for (const { value } of updater.slice(oldKeys.length)) {
              valsToInsert.push(
                parsedValToYjs(
                  schema.element,
                  getInitialPropsValueFromInitializer(schema.element, value)
                )
              );
            }
            if (valsToInsert.length) {
              yArr.insert(oldKeys.length, valsToInsert);
            }
            return;
          }
          // for anything else, just replace the whole array

          const newVals = updater.map((x, i) => {
            const key = newKeys[i];
            const oldIndex = oldKeys.indexOf(key);
            if (oldIndex !== -1) {
              const oldElement = yArr.get(oldIndex);
              if (x.value === undefined) {
                if (oldElement instanceof Y.AbstractType) {
                  return oldElement.clone();
                }
                return oldElement;
              }
              const newVal = updateValue(
                schema.element,
                oldVal[oldIndex],
                x.value
              );
              return parsedValToYjs(schema.element, newVal);
            }
            return parsedValToYjs(
              schema.element,
              getInitialPropsValueFromInitializer(schema.element, x.value)
            );
          });
          yArr.delete(0, yArr.length);
          yArr.insert(0, newVals);
        },
      };
    },
    conditional(schema, stateUpdater) {
      return {
        onChange: (discriminant: string | boolean, value?: unknown) => {
          stateUpdater.yjs().set('discriminant', discriminant);
          if (value !== undefined) {
            const old = yjsToVal(
              schema,
              awareness,
              stateUpdater.yjs().get('value')
            );
            stateUpdater
              .yjs()
              .set(
                'value',
                parsedValToYjs(
                  schema,
                  updateValue(
                    schema.values[discriminant.toString()],
                    old,
                    value
                  )
                )
              );
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
            const oldVal = yjsToVal(
              schema.fields[key],
              awareness,
              stateUpdater.yjs().get(key)
            );
            stateUpdater
              .yjs()
              .set(
                key,
                parsedValToYjs(
                  schema.fields[key],
                  updateValue(schema.fields[key], oldVal, val)
                )
              );
          }
        },
        innerOnChanges: Object.fromEntries(
          Object.entries(schema.fields).map(([key, val]) => {
            let func = Object.assign(
              (newVal: unknown) => {
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
                const yArr = memoized.rawOnChange.yjs();

                const keys = getKeysForArrayValue(yArr);
                const index = keys.indexOf(key);
                const newVal = val(
                  yjsToVal(schema, awareness, yArr.get(index))
                );
                yArr.delete(index);
                yArr.insert(index, [parsedValToYjs(schema.element, newVal)]);
              },
              {
                yjs() {
                  const keys = getKeysForArrayValue(memoized.rawOnChange.yjs());
                  const i = keys.indexOf(key);
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
