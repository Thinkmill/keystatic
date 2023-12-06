import { BasicFormField } from "../../api.js";
import { RequiredValidation } from "../utils.js";
export declare function url<IsRequired extends boolean | undefined>({ label, defaultValue, validation, description, }: {
    label: string;
    defaultValue?: string;
    validation?: {
        isRequired?: IsRequired;
    };
    description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<string | null, string | (IsRequired extends true ? never : null)>;
