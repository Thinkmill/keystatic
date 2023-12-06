import { SlugFormField } from "../../api.js";
export declare function text({ label, defaultValue, validation: { length: { max, min } }, description, multiline, }: {
    label: string;
    defaultValue?: string | (() => string);
    description?: string;
    validation?: {
        length?: {
            min?: number;
            max?: number;
        };
    };
    multiline?: boolean;
}): SlugFormField<string, string, string, null>;
