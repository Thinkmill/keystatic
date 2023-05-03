import { Flex } from '@voussoir/layout';
import { useMemo } from 'react';
import {
  GenericPreviewProps,
  ConditionalField,
  BasicFormField,
  ComponentSchema,
} from '../../api';
import {
  ExtraFieldInputProps,
  isNonChildFieldPreviewProps,
  InnerFormValueContentFromPreviewProps,
} from '../../form-from-preview';
import { AddToPathProvider } from '../text/ui';

export function ConditionalFieldInput<
  DiscriminantField extends BasicFormField<string | boolean>,
  ConditionalValues extends {
    [Key in `${ReturnType<
      DiscriminantField['defaultValue']
    >}`]: ComponentSchema;
  }
>({
  schema,
  autoFocus,
  discriminant,
  onChange,
  value,
  forceValidation,
}: GenericPreviewProps<
  ConditionalField<DiscriminantField, ConditionalValues>,
  unknown
> &
  ExtraFieldInputProps) {
  const schemaDiscriminant = schema.discriminant as BasicFormField<
    string | boolean
  >;
  return (
    <Flex gap="large" direction="column">
      {useMemo(
        () => (
          <AddToPathProvider part="discriminant">
            <schemaDiscriminant.Input
              autoFocus={!!autoFocus}
              value={discriminant}
              onChange={onChange}
              forceValidation={!!forceValidation}
            />
          </AddToPathProvider>
        ),
        [autoFocus, schemaDiscriminant, discriminant, onChange, forceValidation]
      )}
      {isNonChildFieldPreviewProps(value) && (
        <AddToPathProvider part="value">
          <InnerFormValueContentFromPreviewProps
            forceValidation={forceValidation}
            {...value}
          />
        </AddToPathProvider>
      )}
    </Flex>
  );
}
