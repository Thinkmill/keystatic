import { ComponentSchema, GenericPreviewProps, ArrayField, ConditionalField, BasicFormField } from "../../api.js";
export declare function blocks<Schemas extends Record<string, ComponentSchema>>(blocks: {
    [K in keyof Schemas]: {
        label: string;
        itemLabel?: (props: GenericPreviewProps<Schemas[K], unknown>) => string;
        schema: Schemas[K];
    };
}, opts: {
    label: string;
    description?: string;
    validation?: {
        length?: {
            min?: number;
            max?: number;
        };
    };
}): ArrayField<ConditionalField<BasicFormField<keyof Schemas & string>, Schemas>>;
