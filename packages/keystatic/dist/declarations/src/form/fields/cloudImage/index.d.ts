import { cloudImageSchema } from "../../../component-blocks/cloud-image-schema.js";
import { ObjectField } from "../../api.js";
export declare function cloudImage({ label, description, validation, }: {
    label: string;
    description?: string;
    validation?: {
        isRequired?: boolean;
    };
}): ObjectField<typeof cloudImageSchema>;
