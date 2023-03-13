import {
  ArrayField,
  ComponentSchema,
  ConditionalField,
  ValueForComponentSchema,
  FormFieldValue,
  ObjectField,
  GenericPreviewProps,
  BasicFormField,
} from './api';
import * as Y from 'yjs';

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
    [Kind in ComponentSchema['kind']]: (
      schema: Extract<ComponentSchema, { kind: Kind }>,
      stateUpdater: StateUpdaterForSchema[Kind]
    ) => unknown;
  }
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

type StateUpdaterForSchema = {
  object: Y.Map<unknown>;
  array: Y.Array<unknown>;
  conditional: Y.Map<unknown>;
  form: (value: unknown) => void;
  child: null;
};

export function createGetPreviewPropsFromY<
  Schema extends ObjectField<Record<string, ComponentSchema>>,
  ChildFieldElement
>(
  rootSchema: Schema,
  yMap: Y.Map<unknown>,
  getChildFieldElement: (path: readonly string[]) => ChildFieldElement
): (
  value: ValueForComponentSchema<Schema>
) => GenericPreviewProps<Schema, ChildFieldElement> {
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
            onChange: (cb: (val: unknown) => unknown) => void;
            elementWithKey: { key: string } & GenericPreviewProps<
              ComponentSchema,
              ChildFieldElement
            >;
            element: GenericPreviewProps<ComponentSchema, ChildFieldElement>;
          }
        >(),
        onChange(
          updater: readonly { key: string | undefined; value?: unknown }[]
        ) {
          throw new Error('unimplemented');
        },
      };
    },
    child() {},
    conditional(schema, onChange) {
      return {
        onChange: (discriminant: string | boolean, value?: unknown) => {
          throw new Error('unimplemented');
        },
        onChangeForValue: (cb: (prevVal: unknown) => unknown) => {
          throw new Error('unimplemented');
        },
      };
    },
    object(schema, stateUpdater) {
      return {
        onChange: (updater: Record<string, unknown>) => {
          throw new Error('unimplemented');
        },
        innerOnChanges: Object.fromEntries(
          Object.entries(schema.fields).map(([key, val]) => {
            const inner = stateUpdater.get(key);
            return [
              key,
              val.kind === 'array' ||
              val.kind === 'object' ||
              val.kind === 'conditional'
                ? inner
                : val.kind === 'child'
                ? null
                : (() => {
                    let func = (newVal: unknown) => {
                      stateUpdater.set(key, newVal);
                    };
                    func.yjs = inner;
                    return func;
                  })(),
            ];
          })
        ),
      };
    },
  });

  const previewPropsFactories: {
    [Kind in ComponentSchema['kind']]: (
      schema: Extract<ComponentSchema, { kind: Kind }>,
      value: ValueForComponentSchema<Extract<ComponentSchema, { kind: Kind }>>,
      memoized: ReturnType<(typeof memoizedInfoForSchema)[Kind]>,
      path: readonly string[],
      getInnerProp: <Field extends ComponentSchema>(
        schema: Field,
        value: ValueForComponentSchema<Field>,
        onChange: StateUpdaterForSchema[Field['kind']],
        key: string
      ) => GenericPreviewProps<Field, ChildFieldElement>
    ) => GenericPreviewProps<
      Extract<ComponentSchema, { kind: Kind }>,
      ChildFieldElement
    >;
  } = {
    form(schema, value, onChange) {
      return {
        value: value as FormFieldValue,
        onChange,
        options: schema.options,
        schema: schema as any,
      };
    },
    child(schema, value, onChange, path) {
      return { element: getChildFieldElement(path), schema: schema };
    },
    object(schema, value, memoized, path, getInnerProp) {
      const fields: Record<
        string,
        GenericPreviewProps<ComponentSchema, ChildFieldElement>
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
        ObjectField<Record<string, ComponentSchema>>,
        ChildFieldElement
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
        ArrayField<ComponentSchema>,
        ChildFieldElement
      > = {
        elements: arrayValue.map((val, i) => {
          const key = keys[i];
          unusedKeys.delete(key);
          const element = getOrInsert(memoized.inner, key, () => {
            const onChange = (val: (val: unknown) => unknown) => {
              memoized.rawOnChange(prev => {
                const keys = getKeysForArrayValue(prev as readonly unknown[]);
                const index = keys.indexOf(key);
                const newValue = [...(prev as readonly unknown[])];
                newValue[index] = val(newValue[index]);
                setKeysForArrayValue(newValue, keys);
                return newValue;
              });
            };
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
          BasicFormField<string | boolean, unknown>,
          { [key: string]: ComponentSchema }
        >,
        ChildFieldElement
      > = {
        discriminant: value.discriminant as any,
        onChange: memoized.onChange,
        options: schema.discriminant.options,
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

  function getPreviewPropsForProp<Schema extends ComponentSchema>(
    schema: Schema,
    value: unknown,
    memoedThing: { __memoizedThing: true },
    path: readonly string[],
    getInnerProp: <Field extends ComponentSchema>(
      schema: Field,
      value: ValueForComponentSchema<Field>,
      stateUpdater: StateUpdaterForSchema[Field['kind']],
      key: string
    ) => GenericPreviewProps<Field, ChildFieldElement>
  ): GenericPreviewProps<Schema, ChildFieldElement> {
    return previewPropsFactories[schema.kind](
      schema as any,
      value,
      memoedThing as any,
      path,
      getInnerProp
    ) as any;
  }

  function getInitialMemoState<Schema extends ComponentSchema>(
    schema: Schema,
    value: ValueForComponentSchema<Schema>,
    stateUpdater: StateUpdaterForSchema[Schema['kind']],
    path: readonly string[]
  ): MemoState<Schema> {
    const innerState = new Map<string, MemoState<ComponentSchema>>();
    const memoizedInfo = (
      memoizedInfoForSchema[schema.kind] as (
        schema: ComponentSchema,
        stateUpdater: StateUpdaterForSchema[ComponentSchema['kind']]
      ) => any
    )(schema, stateUpdater);
    const state: MemoState<ComponentSchema> = {
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
  function getUpToDateProps<Schema extends ComponentSchema>(
    schema: Schema,
    value: ValueForComponentSchema<Schema>,
    stateUpdater: StateUpdaterForSchema[Schema['kind']],
    memoState: MemoState<Schema>,
    path: readonly string[]
  ): GenericPreviewProps<Schema, ChildFieldElement> {
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

  type MemoState<Schema extends ComponentSchema> = {
    props: GenericPreviewProps<Schema, ChildFieldElement>;
    value: unknown;
    schema: Schema;
    cached: ReturnType<(typeof memoizedInfoForSchema)[Schema['kind']]>;
    inner: Map<string, MemoState<ComponentSchema>>;
  };

  let memoState: MemoState<Schema>;

  return (
    value: ValueForComponentSchema<Schema>
  ): GenericPreviewProps<Schema, ChildFieldElement> => {
    if (memoState === undefined) {
      memoState = getInitialMemoState(rootSchema, value, yMap, []);
      return memoState.props;
    }
    return getUpToDateProps(rootSchema, value, yMap, memoState, []);
  };
}
