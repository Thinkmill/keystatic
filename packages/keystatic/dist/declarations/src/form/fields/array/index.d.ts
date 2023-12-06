import { ComponentSchema, GenericPreviewProps, ArrayField, SlugFormField } from "../../api.js";
export declare function array<ElementField extends ComponentSchema>(element: ElementField, opts?: {
    label?: string;
    description?: string;
    itemLabel?: (props: GenericPreviewProps<ElementField, unknown>) => string;
    asChildTag?: string;
    slugField?: ElementField extends {
        kind: 'object';
    } ? {
        [K in keyof ElementField['fields']]: ElementField['fields'][K] extends SlugFormField<any, any, any, any> ? K : never;
    }[keyof ElementField['fields']] : never;
    validation?: {
        length?: {
            min?: number;
            max?: number;
        };
    };
}): ArrayField<ElementField>;
