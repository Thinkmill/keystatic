import { assert, assertNever } from 'emery';
import { useId } from 'react';

import { Grid } from '@keystar/ui/layout';
import { containerQueries, css } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { ComponentSchema, GenericPreviewProps, ObjectField } from '../../api';
import {
  ExtraFieldInputProps,
  InnerFormValueContentFromPreviewProps,
} from '../../form-from-preview';
import { AddToPathProvider } from '../text/path-slug-context';
import { FIELD_GRID_COLUMNS, FieldContextProvider } from '../context';

export function ObjectFieldInput<
  Fields extends Record<string, ComponentSchema>,
>({
  schema,
  autoFocus,
  fields,
  forceValidation,
}: GenericPreviewProps<ObjectField<Fields>, unknown> & ExtraFieldInputProps) {
  validateLayout(schema);

  const firstFocusable = autoFocus
    ? findFocusableObjectFieldKey(schema)
    : undefined;
  const inner = (
    <Grid
      columns={`repeat(${FIELD_GRID_COLUMNS}, minmax(auto, 1fr))`}
      columnGap="medium"
      rowGap="xlarge"
    >
      {Object.entries(fields).map(([key, propVal], index) => {
        let span = schema.layout?.[index] ?? FIELD_GRID_COLUMNS;
        return (
          <FieldContextProvider key={key} value={{ span }}>
            <div
              className={css({
                gridColumn: `span ${span}`,

                [containerQueries.below.tablet]: {
                  gridColumn: `span ${FIELD_GRID_COLUMNS}`,
                },
              })}
            >
              <AddToPathProvider part={key}>
                <InnerFormValueContentFromPreviewProps
                  forceValidation={forceValidation}
                  autoFocus={key === firstFocusable}
                  marginBottom="xlarge"
                  {...propVal}
                />
              </AddToPathProvider>
            </div>
          </FieldContextProvider>
        );
      })}
    </Grid>
  );
  const id = useId();

  if (!schema.label) {
    return inner;
  }

  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  return (
    <Grid
      role="group"
      gap="medium"
      marginY="xlarge"
      aria-labelledby={labelId}
      aria-describedby={schema.description ? descriptionId : undefined}
    >
      <Text
        color="neutralEmphasis"
        size="medium"
        weight="semibold"
        id={labelId}
      >
        {schema.label}
      </Text>
      {!!schema.description && (
        <Text id={descriptionId} size="regular" color="neutralSecondary">
          {schema.description}
        </Text>
      )}
      <div />
      {inner}
    </Grid>
  );
}

function validateLayout<Fields extends Record<string, ComponentSchema>>(
  schema: ObjectField<Fields>
): void {
  if (!schema.layout) {
    return;
  }

  assert(
    schema.layout.length === Object.keys(schema.fields).length,
    'A column "span" is required for every field in the layout'
  );
  assert(
    schema.layout.every(span => span > 0),
    'The layout must not contain empty columns'
  );
  assert(
    schema.layout.every(span => span <= 12),
    'Fields may not span more than 12 columns'
  );
  assert(
    schema.layout.reduce((acc, cur) => acc + cur, 0) % 12 === 0,
    'The layout must span exactly 12 columns'
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
