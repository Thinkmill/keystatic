import { BasicFormField } from "../../api.js";
export declare function select<Option extends {
    label: string;
    value: string;
}>({ label, options, defaultValue, description, }: {
    label: string;
    options: readonly Option[];
    defaultValue: Option['value'];
    description?: string;
}): BasicFormField<Option['value']> & {
    options: readonly Option[];
};
