import { BasicFormField } from "../../api.js";
import { RequiredValidation } from "../utils.js";
export declare function date<IsRequired extends boolean | undefined>({ label, defaultValue, validation, description, }: {
    label: string;
    defaultValue?: string | {
        kind: 'today';
    };
    validation?: {
        isRequired?: IsRequired;
        min?: string;
        max?: string;
    };
    description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<string | null, string | (IsRequired extends true ? never : null)>;
