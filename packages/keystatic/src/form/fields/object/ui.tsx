'use client';
import { Flex } from '@voussoir/layout';
import { assertNever } from 'emery';
import { ComponentSchema, GenericPreviewProps, ObjectField } from '../../api';
import {
  ExtraFieldInputProps,
  isNonChildFieldPreviewProps,
  InnerFormValueContentFromPreviewProps,
} from '../../form-from-preview';
import { AddToPathProvider } from '../text/ui';

export function ObjectFieldInput<
  Fields extends Record<string, ComponentSchema>
>({
  schema,
  autoFocus,
  fields,
  forceValidation,
}: GenericPreviewProps<ObjectField<Fields>, unknown> & ExtraFieldInputProps) {
  const firstFocusable = autoFocus
    ? findFocusableObjectFieldKey(schema)
    : undefined;
  return (
    <Flex gap="large" direction="column">
      {Object.entries(fields).map(
        ([key, propVal]) =>
          isNonChildFieldPreviewProps(propVal) && (
            <AddToPathProvider key={key} part={key}>
              <InnerFormValueContentFromPreviewProps
                forceValidation={forceValidation}
                autoFocus={key === firstFocusable}
                {...propVal}
              />
            </AddToPathProvider>
          )
      )}
    </Flex>
  );
}

function findFocusableObjectFieldKey(schema: ObjectField): string | undefined {
  for (const [key, innerProp] of Object.entries(schema.fields)) {
    const childFocusable = canFieldBeFocused(innerProp);
    if (childFocusable) {
      return key;
    }
  }
  return undefined;
}

function canFieldBeFocused(schema: ComponentSchema): boolean {
  if (
    schema.kind === 'array' ||
    schema.kind === 'conditional' ||
    schema.kind === 'form'
  ) {
    return true;
  }
  if (schema.kind === 'child') {
    return false;
  }
  if (schema.kind === 'object') {
    for (const innerProp of Object.values(schema.fields)) {
      if (canFieldBeFocused(innerProp)) {
        return true;
      }
    }
    return false;
  }
  assertNever(schema);
}
