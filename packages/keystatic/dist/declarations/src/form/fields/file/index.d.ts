import { AssetFormField } from "../../api.js";
import { RequiredValidation } from "../utils.js";
export declare function file<IsRequired extends boolean | undefined>({ label, directory, validation, description, publicPath, }: {
    label: string;
    directory?: string;
    validation?: {
        isRequired?: IsRequired;
    };
    description?: string;
    publicPath?: string;
} & RequiredValidation<IsRequired>): AssetFormField<{
    data: Uint8Array;
    extension: string;
    filename: string;
} | null, {
    data: Uint8Array;
    extension: string;
    filename: string;
} | (IsRequired extends true ? never : null), string | (IsRequired extends true ? never : null)>;
