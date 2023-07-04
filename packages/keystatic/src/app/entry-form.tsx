import { Grid } from '@keystar/ui/layout';
import { breakpointQueries, useMediaQuery } from '@keystar/ui/style';

import { FormatInfo } from './path-utils';
import { ReadonlyPropPath } from '../form/fields/document/DocumentEditor/component-blocks/utils';
import {
  PathContextProvider,
  SlugFieldProvider,
  AddToPathProvider,
  SlugFieldInfo,
} from '../form/fields/text/ui';
import {
  NonChildFieldComponentSchema,
  InnerFormValueContentFromPreviewProps,
  FormValueContentFromPreviewProps,
} from '../form/form-from-preview';
import {
  GenericPreviewProps,
  ObjectField,
  ComponentSchema,
  Collection,
  Singleton,
} from '..';

const emptyArray: ReadonlyPropPath = [];

export function containerWidthForEntryLayout(
  config: Collection<any, any> | Singleton<any>
) {
  return config.entryLayout === 'content' ? 'large' : 'medium';
}

export function FormForEntry({
  formatInfo,
  forceValidation,
  slugField,
  entryLayout,
  previewProps: _previewProps,
}: {
  previewProps: GenericPreviewProps<
    ObjectField<Record<string, ComponentSchema>>,
    unknown
  >;
  formatInfo: FormatInfo;
  entryLayout: 'content' | 'form' | undefined;
  forceValidation: boolean | undefined;
  slugField: SlugFieldInfo | undefined;
}) {
  const isAboveTablet = useMediaQuery(breakpointQueries.above.tablet);
  const props = _previewProps as GenericPreviewProps<
    ObjectField<Record<string, NonChildFieldComponentSchema>>,
    unknown
  >;

  if (entryLayout === 'content' && formatInfo.contentField && isAboveTablet) {
    const { contentField } = formatInfo;
    return (
      <PathContextProvider value={emptyArray}>
        <SlugFieldProvider value={slugField}>
          <Grid columns="2fr 1fr" gap="xlarge" alignItems="start">
            <AddToPathProvider part={contentField.key}>
              <InnerFormValueContentFromPreviewProps
                forceValidation={forceValidation}
                {...props.fields[contentField.key]}
              />
            </AddToPathProvider>
            <Grid gap="xlarge">
              {Object.entries(props.fields).map(([key, propVal]) =>
                key === contentField.key ? null : (
                  <AddToPathProvider key={key} part={key}>
                    <InnerFormValueContentFromPreviewProps
                      forceValidation={forceValidation}
                      {...propVal}
                    />
                  </AddToPathProvider>
                )
              )}
            </Grid>
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
