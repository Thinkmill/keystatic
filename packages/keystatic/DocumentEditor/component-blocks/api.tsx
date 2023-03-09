import { ReactElement, ReactNode } from 'react';

import { ChildField } from './fields/child';

export type FormFieldValue =
  | string
  | number
  | boolean
  | null
  | readonly FormFieldValue[]
  | { [key: string]: FormFieldValue | undefined };

export type BasicFormField<Value, Options> = {
  kind: 'form';
  Input(props: {
    value: Value;
    onChange(value: Value): void;
    autoFocus: boolean;
    /**
     * This will be true when validate has returned false and the user has attempted to close the form
     * or when the form is open and they attempt to save the item
     */
    forceValidation: boolean;
  }): ReactElement | null;
  /**
   * The options are config about the field that are available on the
   * preview props when rendering the toolbar and preview component
   */
  options: Options;
  defaultValue: Value;
  /**
   * validate will be called in two cases:
   * - on the client in the editor when a user is changing the value.
   *   Returning `false` will block closing the form
   *   and saving the item.
   * - on the server when a change is received before allowing it to be saved
   *   if `true` is returned
   * @param value The value of the form field. You should NOT trust
   * this value to be of the correct type because it could come from
   * a potentially malicious client
   */
  validate(value: unknown): boolean;
};

export type FormField<Value, Options> =
  | BasicFormField<Value, Options>
  | FormFieldWithFile<Value, Options, any>
  | SlugFormField<Value, Options, any>;

export type SlugFormField<Value, Options, SerializedValue> = Omit<
  BasicFormField<Value, Options>,
  'validate'
> & {
  slug: {
    serialize(value: Value): { slug: string; value: SerializedValue };
    parse(data: { slug: string; value: unknown }): Value;
  };
  validate(
    value: unknown,
    slugFieldInfo: { slugs: Set<string> } | undefined
  ): boolean;
};

export type FormFieldWithFile<Value, Options, DataInReader> =
  | FormFieldWithFileRequiringContentsForReader<Value, Options, DataInReader>
  | FormFieldWithFileNotRequiringContentsForReader<
      Value,
      Options,
      DataInReader
    >;

export type FormFieldWithFileRequiringContentsForReader<
  Value,
  Options,
  DataInReader
> = BasicFormField<Value, Options> & {
  serializeToFile:
    | (BaseSerializeToSingleFile<Value> & {
        reader: {
          requiresContentInReader: true;
          parseToReader(data: {
            content: Uint8Array | undefined;
            value: unknown;
            suggestedFilenamePrefix: string | undefined;
          }): DataInReader;
        };
      })
    | (BaseSerializeToFiles<Value> & {
        reader: {
          requiresContentInReader: true;
          parseToReader(data: {
            value: unknown;
            primary: Uint8Array | undefined;
          }): DataInReader;
        };
      });
};
export type FormFieldWithFileNotRequiringContentsForReader<
  Value,
  Options,
  DataInReader
> = BasicFormField<Value, Options> & {
  serializeToFile:
    | (BaseSerializeToSingleFile<Value> & {
        reader: {
          requiresContentInReader: false;
          parseToReader(data: {
            value: unknown;
            suggestedFilenamePrefix: string | undefined;
          }): DataInReader;
        };
      })
    | (BaseSerializeToFiles<Value> & {
        reader: {
          requiresContentInReader: false;
          parseToReader(data: { value: unknown }): DataInReader;
        };
      });
};

type BaseSerializeToSingleFile<Value> = {
  kind: 'asset';
  directory?: string;
  filename(
    value: unknown,
    suggestedFilenamePrefix: string | undefined
  ): string | undefined;
  serialize(
    value: Value,
    suggestedFilenamePrefix: string | undefined
  ): {
    value: unknown;
  } & (
    | { content: undefined }
    | {
        content: Uint8Array;
        filename: string;
      }
  );
  parse(data: {
    content: Uint8Array | undefined;
    value: unknown;
    suggestedFilenamePrefix: string | undefined;
  }): Value;
};

type BaseSerializeToFiles<Value> = {
  kind: 'multi';
  primaryExtension: string;
  directories?: string[];
  serialize(
    value: Value,
    slug: string | undefined
  ): Promise<{
    value: unknown;
    primary: Uint8Array | undefined;
    other: ReadonlyMap<string, Uint8Array>;
    external: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>;
  }>;
  parse(data: {
    value: unknown;
    primary: Uint8Array | undefined;
    other: ReadonlyMap<string, Uint8Array>;
    external?: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>;
    slug: string | undefined;
  }): Value;
};

export type DocumentNode = DocumentElement | DocumentText;

export type DocumentElement = {
  children: DocumentNode[];
  [key: string]: unknown;
};

export type DocumentText = {
  text: string;
  [key: string]: unknown;
};

export type { ChildField } from './fields/child';

export type ArrayField<ElementField extends ComponentSchema> = {
  kind: 'array';
  element: ElementField;
  label: string;
  // this is written with unknown to avoid typescript being annoying about circularity or variance things
  itemLabel?(props: unknown): string;
  asChildTag?: string;
  slugField?: string;
};

export interface ObjectField<
  Fields extends Record<string, ComponentSchema> = Record<
    string,
    ComponentSchema
  >
> {
  kind: 'object';
  fields: Fields;
}

export type ConditionalField<
  DiscriminantField extends BasicFormField<string | boolean, any>,
  ConditionalValues extends {
    [Key in `${DiscriminantField['defaultValue']}`]: ComponentSchema;
  }
> = {
  kind: 'conditional';
  discriminant: DiscriminantField;
  values: ConditionalValues;
};

// this is written like this rather than ArrayField<ComponentSchema> to avoid TypeScript erroring about circularity
type ArrayFieldInComponentSchema = {
  kind: 'array';
  element: ComponentSchema;
  label: string;
  // this is written with unknown to avoid typescript being annoying about circularity or variance things
  itemLabel?(props: unknown): string;
  asChildTag?: string;
  slugField?: string;
};

export type ComponentSchema =
  | ChildField
  | FormField<any, any>
  | ObjectField
  | ConditionalField<
      BasicFormField<any, any>,
      { [key: string]: ComponentSchema }
    >
  | ArrayFieldInComponentSchema;

export * as fields from './fields';

export type ComponentBlock<
  Fields extends Record<string, ComponentSchema> = Record<
    string,
    ComponentSchema
  >
> = {
  preview: (props: any) => ReactElement | null;
  schema: Fields;
  label: string;
} & (
  | {
      chromeless: true;
      toolbar?: (props: {
        props: Record<string, any>;
        onRemove(): void;
      }) => ReactElement;
    }
  | {
      chromeless?: false;
      toolbar?: (props: {
        props: Record<string, any>;
        onShowEditMode(): void;
        onRemove(): void;
        isValid: boolean;
      }) => ReactElement;
    }
);

type ChildFieldPreviewProps<Schema extends ChildField, ChildFieldElement> = {
  readonly element: ChildFieldElement;
  readonly schema: Schema;
};

type FormFieldPreviewProps<Schema extends FormField<any, any>> = {
  readonly value: Schema['defaultValue'];
  onChange(value: Schema['defaultValue']): void;
  readonly options: Schema['options'];
  readonly schema: Schema;
};

type ObjectFieldPreviewProps<
  Schema extends ObjectField<any>,
  ChildFieldElement
> = {
  readonly fields: {
    readonly [Key in keyof Schema['fields']]: GenericPreviewProps<
      Schema['fields'][Key],
      ChildFieldElement
    >;
  };
  onChange(value: {
    readonly [Key in keyof Schema['fields']]?: InitialOrUpdateValueFromComponentPropField<
      Schema['fields'][Key]
    >;
  }): void;
  readonly schema: Schema;
};

type ConditionalFieldPreviewProps<
  Schema extends ConditionalField<BasicFormField<string | boolean, any>, any>,
  ChildFieldElement
> = {
  readonly [Key in keyof Schema['values']]: {
    readonly discriminant: DiscriminantStringToDiscriminantValue<
      Schema['discriminant'],
      Key
    >;
    onChange<Discriminant extends Schema['discriminant']['defaultValue']>(
      discriminant: Discriminant,
      value?: InitialOrUpdateValueFromComponentPropField<
        Schema['values'][`${Discriminant}`]
      >
    ): void;
    readonly options: Schema['discriminant']['options'];
    readonly value: GenericPreviewProps<
      Schema['values'][Key],
      ChildFieldElement
    >;
    readonly schema: Schema;
  };
}[keyof Schema['values']];

type ArrayFieldPreviewProps<
  Schema extends ArrayField<ComponentSchema>,
  ChildFieldElement
> = {
  readonly elements: readonly (GenericPreviewProps<
    Schema['element'],
    ChildFieldElement
  > & {
    readonly key: string;
  })[];
  readonly onChange: (
    value: readonly {
      key: string | undefined;
      value?: InitialOrUpdateValueFromComponentPropField<Schema['element']>;
    }[]
  ) => void;
  readonly schema: Schema;
};

export type GenericPreviewProps<
  Schema extends ComponentSchema,
  ChildFieldElement
> = Schema extends ChildField
  ? ChildFieldPreviewProps<Schema, ChildFieldElement>
  : Schema extends FormField<any, any>
  ? FormFieldPreviewProps<Schema>
  : Schema extends ObjectField<any>
  ? ObjectFieldPreviewProps<Schema, ChildFieldElement>
  : Schema extends ConditionalField<any, any>
  ? ConditionalFieldPreviewProps<Schema, ChildFieldElement>
  : Schema extends ArrayField<any>
  ? ArrayFieldPreviewProps<Schema, ChildFieldElement>
  : never;

export type PreviewProps<Schema extends ComponentSchema> = GenericPreviewProps<
  Schema,
  ReactNode
>;

export type InitialOrUpdateValueFromComponentPropField<
  Schema extends ComponentSchema
> = Schema extends ChildField
  ? undefined
  : Schema extends FormField<infer Value, any>
  ? Value | undefined
  : Schema extends ObjectField<infer Value>
  ? {
      readonly [Key in keyof Value]?: InitialOrUpdateValueFromComponentPropField<
        Value[Key]
      >;
    }
  : Schema extends ConditionalField<infer DiscriminantField, infer Values>
  ? {
      readonly [Key in keyof Values]: {
        readonly discriminant: DiscriminantStringToDiscriminantValue<
          DiscriminantField,
          Key
        >;
        readonly value?: InitialOrUpdateValueFromComponentPropField<
          Values[Key]
        >;
      };
    }[keyof Values]
  : Schema extends ArrayField<infer ElementField>
  ? readonly {
      key: string | undefined;
      value?: InitialOrUpdateValueFromComponentPropField<ElementField>;
    }[]
  : never;

type DiscriminantStringToDiscriminantValue<
  DiscriminantField extends FormField<any, any>,
  DiscriminantString extends PropertyKey
> = DiscriminantField['defaultValue'] extends boolean
  ? 'true' extends DiscriminantString
    ? true
    : 'false' extends DiscriminantString
    ? false
    : never
  : DiscriminantString;

export type PreviewPropsForToolbar<Schema extends ComponentSchema> =
  GenericPreviewProps<Schema, undefined>;

export function component<
  Schema extends {
    [Key in any]: ComponentSchema;
  }
>(
  options: {
    /** The preview component shown in the editor */
    preview: (props: PreviewProps<ObjectField<Schema>>) => ReactElement | null;
    /** The schema for the props that the preview component, toolbar and rendered component will receive */
    schema: Schema;
    /** The label to show in the insert menu and chrome around the block if chromeless is false */
    label: string;
  } & (
    | {
        chromeless: true;
        toolbar?: (props: {
          props: PreviewPropsForToolbar<ObjectField<Schema>>;
          onRemove(): void;
        }) => ReactElement;
      }
    | {
        chromeless?: false;
        toolbar?: (props: {
          props: PreviewPropsForToolbar<ObjectField<Schema>>;
          onShowEditMode(): void;
          onRemove(): void;
        }) => ReactElement;
      }
  )
): ComponentBlock<Schema> {
  return options as any;
}

type Comp<Props> = (props: Props) => ReactElement | null;

export type ValueForComponentSchema<Schema extends ComponentSchema> =
  Schema extends ChildField
    ? null
    : Schema extends FormField<infer Value, any>
    ? Value
    : Schema extends ObjectField<infer Value>
    ? {
        readonly [Key in keyof Value]: ValueForComponentSchema<Value[Key]>;
      }
    : Schema extends ConditionalField<infer DiscriminantField, infer Values>
    ? {
        readonly [Key in keyof Values]: {
          readonly discriminant: DiscriminantStringToDiscriminantValue<
            DiscriminantField,
            Key
          >;
          readonly value: ValueForComponentSchema<Values[Key]>;
        };
      }[keyof Values]
    : Schema extends ArrayField<infer ElementField>
    ? readonly ValueForComponentSchema<ElementField>[]
    : never;

export type ValueForReading<Schema extends ComponentSchema> =
  Schema extends ChildField
    ? null
    : Schema extends FormFieldWithFileRequiringContentsForReader<
        any,
        any,
        infer Value
      >
    ? () => Promise<Value>
    : Schema extends FormFieldWithFileNotRequiringContentsForReader<
        any,
        any,
        infer Value
      >
    ? Value
    : Schema extends SlugFormField<infer Value, any, any>
    ? Value
    : Schema extends BasicFormField<infer Value, any>
    ? Value
    : Schema extends ObjectField<infer Value>
    ? {
        readonly [Key in keyof Value]: ValueForReading<Value[Key]>;
      }
    : Schema extends ConditionalField<infer DiscriminantField, infer Values>
    ? {
        readonly [Key in keyof Values]: {
          readonly discriminant: DiscriminantStringToDiscriminantValue<
            DiscriminantField,
            Key
          >;
          readonly value: ValueForReading<Values[Key]>;
        };
      }[keyof Values]
    : Schema extends ArrayField<infer ElementField>
    ? readonly ValueForReading<ElementField>[]
    : never;

export type InferRenderersForComponentBlocks<
  ComponentBlocks extends Record<string, ComponentBlock<any>>
> = {
  [Key in keyof ComponentBlocks]: Comp<
    ValueForReading<ObjectField<ComponentBlocks[Key]['schema']>>
  >;
};
