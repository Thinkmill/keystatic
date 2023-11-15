import { Flex } from '@keystar/ui/layout';
import { useMemo } from 'react';
import {
  GenericPreviewProps,
  ConditionalField,
  BasicFormField,
  ComponentSchema,
} from '../../api';
import {
  ExtraFieldInputProps,
  InnerFormValueContentFromPreviewProps,
} from '../../form-from-preview';
import { AddToPathProvider } from '../text/path-slug-context';

export function ConditionalFieldInput<
  DiscriminantField extends BasicFormField<string | boolean>,
  ConditionalValues extends {
    [Key in `${ReturnType<
      DiscriminantField['defaultValue']
    >}`]: ComponentSchema;
  },
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
    <Flex gap="xlarge" direction="column">
      {useMemo(
        () => (
          <AddToPathProvider part="discriminant">
            <schemaDiscriminant.Input
              autoFocus={!!autoFocus}
              value={discriminant}
              onChange={onChange}
              forceValidation={forceValidation}
            />
          </AddToPathProvider>
        ),
        [autoFocus, schemaDiscriminant, discriminant, onChange, forceValidation]
      )}
      <AddToPathProvider part="value">
        <InnerFormValueContentFromPreviewProps
          forceValidation={forceValidation}
          {...value}
        />
      </AddToPathProvider>
    </Flex>
  );
}
