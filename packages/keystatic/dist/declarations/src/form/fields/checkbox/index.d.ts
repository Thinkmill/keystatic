import { BasicFormField } from "../../api.js";
export declare function checkbox({ label, defaultValue, description, }: {
    label: string;
    defaultValue?: boolean;
    description?: string;
}): BasicFormField<boolean>;
