import { BasicFormField } from "../../api.js";
import { RequiredValidation } from "../utils.js";
export declare function integer<IsRequired extends boolean | undefined>({ label, defaultValue, validation, description, }: {
    label: string;
    defaultValue?: number;
    validation?: {
        isRequired?: IsRequired;
        min: number;
        max: number;
    };
    description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<number | null, number | (IsRequired extends true ? never : null)>;
