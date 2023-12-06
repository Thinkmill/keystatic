import { BasicFormField } from "../../api.js";
export declare function multiselect<Option extends {
    label: string;
    value: string;
}>({ label, options, defaultValue, description, }: {
    label: string;
    options: readonly Option[];
    defaultValue?: readonly Option['value'][];
    description?: string;
}): BasicFormField<readonly Option['value'][]> & {
    options: readonly Option[];
};
