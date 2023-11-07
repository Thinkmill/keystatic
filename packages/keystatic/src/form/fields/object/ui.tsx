import { Flex } from '@keystar/ui/layout';
import { assertNever } from 'emery';
import { ComponentSchema, GenericPreviewProps, ObjectField } from '../../api';
import {
  ExtraFieldInputProps,
  InnerFormValueContentFromPreviewProps,
} from '../../form-from-preview';
import { AddToPathProvider } from '../text/path-slug-context';
import { useId } from 'react';
import { Text } from '@keystar/ui/typography';

export function ObjectFieldInput<
  Fields extends Record<string, ComponentSchema>,
>({
  schema,
  autoFocus,
  fields,
  forceValidation,
}: GenericPreviewProps<ObjectField<Fields>, unknown> & ExtraFieldInputProps) {
  const firstFocusable = autoFocus
    ? findFocusableObjectFieldKey(schema)
    : undefined;
  const inner = (
    <Flex gap="xlarge" direction="column">
      {Object.entries(fields).map(([key, propVal]) => (
        <AddToPathProvider key={key} part={key}>
          <InnerFormValueContentFromPreviewProps
            forceValidation={forceValidation}
            autoFocus={key === firstFocusable}
            {...propVal}
          />
        </AddToPathProvider>
      ))}
    </Flex>
  );
  const id = useId();

  if (!schema.label) {
    return inner;
  }

  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  return (
    <Flex
      role="group"
      gap="medium"
      marginY="large"
      aria-labelledby={labelId}
      aria-describedby={schema.description ? descriptionId : undefined}
      direction="column"
    >
      <Text color="neutral" size="medium" weight="medium" id={labelId}>
        {schema.label}
      </Text>
      {!!schema.description && (
        <Text id={descriptionId} size="regular" color="neutralSecondary">
          {schema.description}
        </Text>
      )}
      {inner}
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
