import { Flex, Grid } from '@voussoir/layout';
import { DOCUMENT_FIELD_SYMBOL } from '../DocumentEditor/component-blocks/fields/document';
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
import { FormatInfo } from './path-utils';

const emptyArray: ReadonlyPropPath = [];

function hasSplitView(
  formatInfo: FormatInfo,
  schema: ObjectField<Record<string, ComponentSchema>>
): formatInfo is FormatInfo & { contentField: {} } {
  return (
    formatInfo.contentField !== undefined &&
    DOCUMENT_FIELD_SYMBOL in schema.fields[formatInfo.contentField.key]
  );
}

export function FormForEntry({
  formatInfo,
  forceValidation,
  slugField,
  ..._props
}: GenericPreviewProps<
  ObjectField<Record<string, ComponentSchema>>,
  unknown
> & {
  formatInfo: FormatInfo;
  forceValidation: boolean | undefined;
  slugField: { slugs: Set<string>; field: string } | undefined;
}) {
  const props = _props as GenericPreviewProps<
    ObjectField<Record<string, NonChildFieldComponentSchema>>,
    unknown
  >;
  if (hasSplitView(formatInfo, props.schema)) {
    return (
      <PathContextProvider value={emptyArray}>
        <SlugFieldProvider value={slugField}>
          <Grid columns={['2fr', '1fr']} gap="large">
            <AddToPathProvider part={formatInfo.contentField.key}>
              <InnerFormValueContentFromPreviewProps
                forceValidation={forceValidation}
                {...props.fields[formatInfo.contentField.key]}
              />
            </AddToPathProvider>
            <Flex gap="xlarge" direction="column">
              {Object.entries(props.fields).map(([key, propVal]) =>
                key === formatInfo.contentField.key ? null : (
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
