import { BasicFormField } from "../../api.js";
import { RequiredValidation } from "../utils.js";
export declare function pathReference<IsRequired extends boolean | undefined>({ label, pattern, validation, description, }: {
    label: string;
    pattern?: string;
    validation?: {
        isRequired?: IsRequired;
    };
    description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<string | null, string | (IsRequired extends true ? never : null)>;
