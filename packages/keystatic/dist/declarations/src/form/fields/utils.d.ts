import { ReactElement } from 'react';
import { BasicFormField, FormFieldInputProps, FormFieldStoredValue } from "../api.js";
export type RequiredValidation<IsRequired extends boolean | undefined> = IsRequired extends true ? {
    validation: {
        isRequired: true;
    };
} : unknown;
export declare function assertRequired<T, IsRequired extends boolean | undefined>(value: T | null, validation: undefined | {
    isRequired?: IsRequired;
}, label: string): asserts value is T | (IsRequired extends true ? never : null);
export declare function basicFormFieldWithSimpleReaderParse<ParsedValue extends {} | null, ValidatedValue extends ParsedValue>(config: {
    Input(props: FormFieldInputProps<ParsedValue>): ReactElement | null;
    defaultValue(): ParsedValue;
    parse(value: FormFieldStoredValue): ParsedValue;
    /**
     * If undefined is returned, the field will generally not be written,
     * except in array fields where it will be stored as null
     */
    serialize(value: ParsedValue): {
        value: FormFieldStoredValue;
    };
    validate(value: ParsedValue): ValidatedValue;
}): BasicFormField<ParsedValue, ValidatedValue, ValidatedValue>;
