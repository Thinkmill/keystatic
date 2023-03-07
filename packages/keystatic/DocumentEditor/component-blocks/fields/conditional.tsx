import { BasicFormField, ComponentSchema, ConditionalField } from '../api';

export function conditional<
  DiscriminantField extends BasicFormField<string | boolean, any>,
  ConditionalValues extends {
    [Key in `${DiscriminantField['defaultValue']}`]: ComponentSchema;
  }
>(
  discriminant: DiscriminantField,
  values: ConditionalValues
): ConditionalField<DiscriminantField, ConditionalValues> {
  if (
    (discriminant.validate('true') || discriminant.validate('false')) &&
    (discriminant.validate(true) || discriminant.validate(false))
  ) {
    throw new Error(
      'The discriminant of a conditional field only supports string values, or boolean values, not both.'
    );
  }
  return {
    kind: 'conditional',
    discriminant,
    values: values,
  };
}
