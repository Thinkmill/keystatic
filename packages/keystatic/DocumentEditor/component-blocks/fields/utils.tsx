export type RequiredValidation<IsRequired extends boolean | undefined> =
  IsRequired extends true ? { validation: { isRequired: true } } : unknown;
