import { SlugFormField } from "../../api.js";
export declare function slug(args: {
    name: {
        label: string;
        defaultValue?: string;
        description?: string;
        validation?: {
            length?: {
                min?: number;
                max?: number;
            };
        };
    };
    slug?: {
        label?: string;
        generate?: (name: string) => string;
        description?: string;
        validation?: {
            length?: {
                min?: number;
                max?: number;
            };
        };
    };
}): SlugFormField<{
    name: string;
    slug: string;
}, {
    name: string;
    slug: string;
}, {
    name: string;
    slug: string;
}, string>;
