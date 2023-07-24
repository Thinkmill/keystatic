import { Box, Grid } from '@keystar/ui/layout';
import {
  SplitView,
  SplitPanePrimary,
  SplitPaneSecondary,
} from '@keystar/ui/split-view';

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
import { ScrollView } from './shell/primitives';
import { PageContainer } from './shell/page';
import { useContentPanelQuery } from './shell/context';

const emptyArray: ReadonlyPropPath = [];

export function containerWidthForEntryLayout(
  config: Collection<any, any> | Singleton<any>
) {
  return config.entryLayout === 'content' ? 'none' : 'medium';
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
  const isAboveMobile = useContentPanelQuery({ above: 'mobile' });
  const props = _previewProps as GenericPreviewProps<
    ObjectField<Record<string, NonChildFieldComponentSchema>>,
    unknown
  >;

  if (entryLayout === 'content' && formatInfo.contentField && isAboveMobile) {
    const { contentField } = formatInfo;
    return (
      <PathContextProvider value={emptyArray}>
        <SlugFieldProvider value={slugField}>
          <SplitView
            autoSaveId="keystatic-content-split-view"
            defaultSize={320}
            minSize={240}
            maxSize={480}
            flex
          >
            <SplitPaneSecondary>
              <ScrollView>
                <Box
                  padding={{
                    mobile: 'medium',
                    tablet: 'xlarge',
                    desktop: 'xxlarge',
                  }}
                  minHeight={0}
                  minWidth={0}
                  maxWidth="container.medium"
                  marginX="auto"
                >
                  <AddToPathProvider part={contentField.key}>
                    <InnerFormValueContentFromPreviewProps
                      forceValidation={forceValidation}
                      {...props.fields[contentField.key]}
                    />
                  </AddToPathProvider>
                </Box>
              </ScrollView>
            </SplitPaneSecondary>
            <SplitPanePrimary>
              <ScrollView>
                <Grid
                  gap="xlarge"
                  padding={{
                    mobile: 'medium',
                    tablet: 'xlarge',
                    desktop: 'xxlarge',
                  }}
                >
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
              </ScrollView>
            </SplitPanePrimary>
          </SplitView>
        </SlugFieldProvider>
      </PathContextProvider>
    );
  }

  return (
    <ScrollView>
      <PageContainer
        paddingY={{ mobile: 'medium', tablet: 'xlarge', desktop: 'xxlarge' }}
      >
        <FormValueContentFromPreviewProps
          // autoFocus
          forceValidation={forceValidation}
          slugField={slugField}
          {...props}
        />
      </PageContainer>
    </ScrollView>
  );
}
