import { BasicFormField } from "../../api.js";
import { RequiredValidation } from "../utils.js";
export declare function relationship<IsRequired extends boolean | undefined>({ label, collection, validation, description, }: {
    label: string;
    collection: string;
    validation?: {
        isRequired?: IsRequired;
    };
    description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<string | null, string | (IsRequired extends true ? never : null)>;
