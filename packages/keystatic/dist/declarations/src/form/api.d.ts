import { ReactElement, ReactNode } from 'react';
import { Glob } from "../config.js";
import { ChildField } from "./fields/child.js";
export type FormFieldInputProps<Value> = {
    value: Value;
    onChange(value: Value): void;
    autoFocus: boolean;
    /**
     * This will be true when validate has returned false and the user has attempted to close the form
     * or when the form is open and they attempt to save the item
     */
    forceValidation: boolean;
};
export type JsonValue = string | number | boolean | null | readonly JsonValue[] | {
    [key: string]: JsonValue;
};
type JsonValueWithoutNull = JsonValue & {};
export type FormFieldStoredValue = JsonValueWithoutNull | undefined;
export type BasicFormField<ParsedValue extends {} | null, ValidatedValue extends ParsedValue = ParsedValue, ReaderValue = ValidatedValue> = {
    kind: 'form';
    formKind?: undefined;
    Input(props: FormFieldInputProps<ParsedValue>): ReactElement | null;
    defaultValue(): ParsedValue;
    parse(value: FormFieldStoredValue): ParsedValue;
    /**
     * If undefined is returned, the field will generally not be written,
     * except in array fields where it will be stored as null
     */
    serialize(value: ParsedValue): {
        value: FormFieldStoredValue;
    };
    validate(value: ParsedValue): ValidatedValue;
    reader: {
        parse(value: FormFieldStoredValue): ReaderValue;
    };
};
export type SlugFormField<ParsedValue extends {} | null, ValidatedValue extends ParsedValue, ReaderValue, ReaderValueAsSlugField> = {
    kind: 'form';
    formKind: 'slug';
    Input(props: FormFieldInputProps<ParsedValue>): ReactElement | null;
    defaultValue(): ParsedValue;
    parse(value: FormFieldStoredValue, extra: {
        slug: string;
    } | undefined): ParsedValue;
    serialize(value: ParsedValue): {
        value: FormFieldStoredValue;
    };
    serializeWithSlug(value: ParsedValue): {
        slug: string;
        value: FormFieldStoredValue;
    };
    validate(value: ParsedValue, extra: {
        slugField: {
            slugs: Set<string>;
            glob: Glob;
        };
    } | undefined): ValidatedValue;
    reader: {
        parse(value: FormFieldStoredValue): ReaderValue;
        parseWithSlug(value: FormFieldStoredValue, extra: {
            slug: string;
            glob: Glob;
        }): ReaderValueAsSlugField;
    };
};
export type AssetFormField<ParsedValue extends {} | null, ValidatedValue extends ParsedValue, ReaderValue> = {
    kind: 'form';
    formKind: 'asset';
    Input(props: FormFieldInputProps<ParsedValue>): ReactElement | null;
    directory?: string;
    defaultValue(): ParsedValue;
    filename(value: FormFieldStoredValue, extra: {
        suggestedFilenamePrefix: string | undefined;
        slug: string | undefined;
    }): string | undefined;
    parse(value: FormFieldStoredValue, extra: {
        asset: Uint8Array | undefined;
        slug: string | undefined;
    }): ParsedValue;
    serialize(value: ParsedValue, extra: {
        suggestedFilenamePrefix: string | undefined;
        slug: string | undefined;
    }): {
        value: FormFieldStoredValue;
        asset: {
            content: Uint8Array;
            filename: string;
        } | undefined;
    };
    validate(value: ParsedValue): ValidatedValue;
    reader: {
        parse(value: FormFieldStoredValue): ReaderValue;
    };
};
export type ContentFormField<ParsedValue extends {} | null, ValidatedValue extends ParsedValue, ReaderValue> = {
    kind: 'form';
    formKind: 'content';
    contentExtension: string;
    directories?: string[];
    Input(props: FormFieldInputProps<ParsedValue>): ReactElement | null;
    defaultValue(): ParsedValue;
    parse(value: FormFieldStoredValue, args: {
        content: Uint8Array | undefined;
        other: ReadonlyMap<string, Uint8Array>;
        external: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>;
        slug: string | undefined;
    }): ParsedValue;
    serialize(value: ParsedValue, extra: {
        slug: string | undefined;
    }): {
        value: FormFieldStoredValue;
        content: Uint8Array | undefined;
        other: ReadonlyMap<string, Uint8Array>;
        external: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>;
    };
    validate(value: ParsedValue): ValidatedValue;
    reader: {
        parse(value: FormFieldStoredValue, extra: {
            content: Uint8Array | undefined;
        }): ReaderValue;
    };
};
export type FormField<ParsedValue extends {} | null, ValidatedValue extends ParsedValue, ReaderValue> = BasicFormField<ParsedValue, ValidatedValue, ReaderValue> | SlugFormField<ParsedValue, ValidatedValue, ReaderValue, any> | AssetFormField<ParsedValue, ValidatedValue, ReaderValue> | ContentFormField<ParsedValue, ValidatedValue, ReaderValue>;
export type DocumentNode = DocumentElement | DocumentText;
export type DocumentElement = {
    children: DocumentNode[];
    [key: string]: unknown;
};
export type DocumentText = {
    text: string;
    [key: string]: unknown;
};
export type { ChildField } from "./fields/child.js";
export type ArrayField<ElementField extends ComponentSchema> = {
    kind: 'array';
    element: ElementField;
    label: string;
    description?: string;
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
export type ObjectFieldOptions = {
    label?: string;
    description?: string;
    /**
     * Define the number of columns each field should span. The grid layout
     * supports 12 possible columns.
     * @example [6, 6] - "one row, equal columns"
     * @example [12, 8, 4] - "one field in the first row, two fields in the second row"
     */
    layout?: number[];
};
export interface ObjectField<Fields extends Record<string, ComponentSchema> = Record<string, ComponentSchema>> extends ObjectFieldOptions {
    kind: 'object';
    fields: Fields;
    Input?(props: unknown): ReactElement | null;
}
export type ConditionalField<DiscriminantField extends BasicFormField<string | boolean>, ConditionalValues extends {
    [Key in `${ReturnType<DiscriminantField['defaultValue']>}`]: ComponentSchema;
}> = {
    kind: 'conditional';
    discriminant: DiscriminantField;
    values: ConditionalValues;
    Input?(props: unknown): ReactElement | null;
};
type ArrayFieldInComponentSchema = {
    kind: 'array';
    element: ComponentSchema;
    label: string;
    description?: string;
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
export type ComponentSchema = ChildField | FormField<any, any, any> | ObjectField | ConditionalField<BasicFormField<any, any, any>, {
    [key: string]: ComponentSchema;
}> | ArrayFieldInComponentSchema;
export * as fields from "./fields/index.js";
export type ComponentBlock<Fields extends Record<string, ComponentSchema> = Record<string, ComponentSchema>> = {
    preview: (props: any) => ReactElement | null;
    schema: Fields;
    label: string;
    toolbarIcon?: ReactElement;
} & ({
    chromeless: true;
    toolbar?: (props: {
        props: Record<string, any>;
        onRemove(): void;
    }) => ReactElement;
} | {
    chromeless?: false;
    toolbar?: (props: {
        props: Record<string, any>;
        onShowEditMode(): void;
        onRemove(): void;
        isValid: boolean;
    }) => ReactElement;
});
type ChildFieldPreviewProps<Schema extends ChildField, ChildFieldElement> = {
    readonly element: ChildFieldElement;
    readonly schema: Schema;
};
type FormFieldPreviewProps<Schema extends FormField<any, any, any>> = {
    readonly value: ReturnType<Schema['defaultValue']>;
    onChange(value: ReturnType<Schema['defaultValue']>): void;
    readonly schema: Schema;
};
type ObjectFieldPreviewProps<Schema extends ObjectField<any>, ChildFieldElement> = {
    readonly fields: {
        readonly [Key in keyof Schema['fields']]: GenericPreviewProps<Schema['fields'][Key], ChildFieldElement>;
    };
    onChange(value: {
        readonly [Key in keyof Schema['fields']]?: InitialOrUpdateValueFromComponentPropField<Schema['fields'][Key]>;
    }): void;
    readonly schema: Schema;
};
type ConditionalFieldPreviewProps<Schema extends ConditionalField<BasicFormField<string | boolean>, any>, ChildFieldElement> = {
    readonly [Key in keyof Schema['values']]: {
        readonly discriminant: DiscriminantStringToDiscriminantValue<Schema['discriminant'], Key>;
        onChange<Discriminant extends ReturnType<Schema['discriminant']['defaultValue']>>(discriminant: Discriminant, value?: InitialOrUpdateValueFromComponentPropField<Schema['values'][`${Discriminant}`]>): void;
        readonly value: GenericPreviewProps<Schema['values'][Key], ChildFieldElement>;
        readonly schema: Schema;
    };
}[keyof Schema['values']];
type ArrayFieldPreviewProps<Schema extends ArrayField<ComponentSchema>, ChildFieldElement> = {
    readonly elements: readonly (GenericPreviewProps<Schema['element'], ChildFieldElement> & {
        readonly key: string;
    })[];
    readonly onChange: (value: readonly {
        key: string | undefined;
        value?: InitialOrUpdateValueFromComponentPropField<Schema['element']>;
    }[]) => void;
    readonly schema: Schema;
};
export type GenericPreviewProps<Schema extends ComponentSchema, ChildFieldElement> = Schema extends ChildField ? ChildFieldPreviewProps<Schema, ChildFieldElement> : Schema extends FormField<any, any, any> ? FormFieldPreviewProps<Schema> : Schema extends ObjectField<any> ? ObjectFieldPreviewProps<Schema, ChildFieldElement> : Schema extends ConditionalField<any, any> ? ConditionalFieldPreviewProps<Schema, ChildFieldElement> : Schema extends ArrayField<any> ? ArrayFieldPreviewProps<Schema, ChildFieldElement> : never;
export type PreviewProps<Schema extends ComponentSchema> = GenericPreviewProps<Schema, ReactNode>;
export type InitialOrUpdateValueFromComponentPropField<Schema extends ComponentSchema> = Schema extends ChildField ? undefined : Schema extends FormField<infer ParsedValue, any, any> ? ParsedValue | undefined : Schema extends ObjectField<infer Value> ? {
    readonly [Key in keyof Value]?: InitialOrUpdateValueFromComponentPropField<Value[Key]>;
} : Schema extends ConditionalField<infer DiscriminantField, infer Values> ? {
    readonly [Key in keyof Values]: {
        readonly discriminant: DiscriminantStringToDiscriminantValue<DiscriminantField, Key>;
        readonly value?: InitialOrUpdateValueFromComponentPropField<Values[Key]>;
    };
}[keyof Values] : Schema extends ArrayField<infer ElementField> ? readonly {
    key: string | undefined;
    value?: InitialOrUpdateValueFromComponentPropField<ElementField>;
}[] : never;
type DiscriminantStringToDiscriminantValue<DiscriminantField extends FormField<any, any, any>, DiscriminantString extends PropertyKey> = ReturnType<DiscriminantField['defaultValue']> extends boolean ? 'true' extends DiscriminantString ? true : 'false' extends DiscriminantString ? false : never : DiscriminantString & string;
export type PreviewPropsForToolbar<Schema extends ComponentSchema> = GenericPreviewProps<Schema, undefined>;
export declare function component<Schema extends {
    [Key in any]: ComponentSchema;
}>(options: {
    /** The preview component shown in the editor */
    preview: (props: PreviewProps<ObjectField<Schema>> & {
        onRemove(): void;
    }) => ReactElement | null;
    /** The schema for the props that the preview component, toolbar and rendered component will receive */
    schema: Schema;
    /** The label to show in the insert menu and chrome around the block if chromeless is false */
    label: string;
    /** An icon to show in the toolbar for this component block. Component blocks with `toolbarIcon` are shown in the toolbar directly instead of the insert menu */
    toolbarIcon?: ReactElement;
} & ({
    chromeless: true;
    toolbar?: null | ((props: {
        props: PreviewPropsForToolbar<ObjectField<Schema>>;
        onRemove(): void;
    }) => ReactElement);
} | {
    chromeless?: false;
    toolbar?: (props: {
        props: PreviewPropsForToolbar<ObjectField<Schema>>;
        onShowEditMode(): void;
        onRemove(): void;
    }) => ReactElement;
})): ComponentBlock<Schema>;
type Comp<Props> = (props: Props) => ReactElement | null;
export type ParsedValueForComponentSchema<Schema extends ComponentSchema> = Schema extends ChildField ? null : Schema extends FormField<infer Value, any, any> ? Value : Schema extends ObjectField<infer Value> ? {
    readonly [Key in keyof Value]: ParsedValueForComponentSchema<Value[Key]>;
} : Schema extends ConditionalField<infer DiscriminantField, infer Values> ? {
    readonly [Key in keyof Values]: {
        readonly discriminant: DiscriminantStringToDiscriminantValue<DiscriminantField, Key>;
        readonly value: ParsedValueForComponentSchema<Values[Key]>;
    };
}[keyof Values] : Schema extends ArrayField<infer ElementField> ? readonly ParsedValueForComponentSchema<ElementField>[] : never;
export type ValueForReading<Schema extends ComponentSchema> = Schema extends ChildField ? null : Schema extends ContentFormField<any, any, infer Value> ? () => Promise<Value> : Schema extends BasicFormField<any, any, infer Value> ? Value : Schema extends SlugFormField<any, any, infer Value, any> ? Value : Schema extends AssetFormField<any, any, infer Value> ? Value : Schema extends ObjectField<infer Value> ? {
    readonly [Key in keyof Value]: ValueForReading<Value[Key]>;
} : Schema extends ConditionalField<infer DiscriminantField, infer Values> ? {
    readonly [Key in keyof Values]: {
        readonly discriminant: DiscriminantStringToDiscriminantValue<DiscriminantField, Key>;
        readonly value: ValueForReading<Values[Key]>;
    };
}[keyof Values] : Schema extends ArrayField<infer ElementField> ? readonly ValueForReading<ElementField>[] : never;
export type ValueForReadingDeep<Schema extends ComponentSchema> = Schema extends ChildField ? null : Schema extends FormField<any, any, infer Value> ? Value : Schema extends ObjectField<infer Value> ? {
    readonly [Key in keyof Value]: ValueForReadingDeep<Value[Key]>;
} : Schema extends ConditionalField<infer DiscriminantField, infer Values> ? {
    readonly [Key in keyof Values]: {
        readonly discriminant: DiscriminantStringToDiscriminantValue<DiscriminantField, Key>;
        readonly value: ValueForReadingDeep<Values[Key]>;
    };
}[keyof Values] : Schema extends ArrayField<infer ElementField> ? readonly ValueForReadingDeep<ElementField>[] : never;
export type InferRenderersForComponentBlocks<ComponentBlocks extends Record<string, ComponentBlock<any>>> = {
    [Key in keyof ComponentBlocks]: Comp<ValueForReading<ObjectField<ComponentBlocks[Key]['schema']>>>;
};
