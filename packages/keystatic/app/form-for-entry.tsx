import { Flex, Grid } from '@voussoir/layout';
import {
  AddToPathProvider,
  PathContextProvider,
  SlugFieldProvider,
} from '../DocumentEditor/component-blocks/fields/text';
import {
  FormValueContentFromPreviewProps,
  InnerFormValueContentFromPreviewProps,
  NonChildFieldComponentSchema,
} from '../DocumentEditor/component-blocks/form-from-preview';
import { ReadonlyPropPath } from '../DocumentEditor/component-blocks/utils';
import { ComponentSchema, GenericPreviewProps, ObjectField } from '../src';

const emptyArray: ReadonlyPropPath = [];

export function FormForEntry({
  contentField,
  forceValidation,
  slugField,
  ..._props
}: GenericPreviewProps<
  ObjectField<Record<string, ComponentSchema>>,
  unknown
> & {
  contentField: string | undefined;
  forceValidation: boolean | undefined;
  slugField: { slugs: Set<string>; field: string } | undefined;
}) {
  const props = _props as GenericPreviewProps<
    ObjectField<Record<string, NonChildFieldComponentSchema>>,
    unknown
  >;
  if (contentField !== undefined) {
    return (
      <PathContextProvider value={emptyArray}>
        <SlugFieldProvider value={slugField}>
          <Grid columns={['2fr', '1fr']} gap="large">
            <AddToPathProvider part={contentField}>
              <InnerFormValueContentFromPreviewProps
                forceValidation={forceValidation}
                {...props.fields[contentField]}
              />
            </AddToPathProvider>
            <Flex gap="xlarge" direction="column">
              {Object.entries(props.fields).map(([key, propVal]) =>
                key === contentField ? null : (
                  <AddToPathProvider key={key} part={key}>
                    <InnerFormValueContentFromPreviewProps
                      forceValidation={forceValidation}
                      {...propVal}
                    />
                  </AddToPathProvider>
                )
              )}
            </Flex>
          </Grid>
        </SlugFieldProvider>
      </PathContextProvider>
    );
  }
  return (
    <FormValueContentFromPreviewProps
      autoFocus
      forceValidation={forceValidation}
      slugField={slugField}
      {...props}
    />
  );
}
