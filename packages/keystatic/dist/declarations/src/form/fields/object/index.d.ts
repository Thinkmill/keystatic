import { ComponentSchema, ObjectField, ObjectFieldOptions } from "../../api.js";
export declare function object<Fields extends Record<string, ComponentSchema>>(fields: Fields, opts?: ObjectFieldOptions): ObjectField<Fields>;
