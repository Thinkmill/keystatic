import { BasicFormField, ComponentSchema, ConditionalField } from "../../api.js";
export declare function conditional<DiscriminantField extends BasicFormField<string> | BasicFormField<boolean>, ConditionalValues extends {
    [Key in `${ReturnType<DiscriminantField['defaultValue']>}`]: ComponentSchema;
}>(discriminant: DiscriminantField, values: ConditionalValues): ConditionalField<DiscriminantField, ConditionalValues>;
