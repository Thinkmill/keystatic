import { Grid } from '@keystar/ui/layout';
import {
  SplitView,
  SplitPanePrimary,
  SplitPaneSecondary,
} from '@keystar/ui/split-view';
import { ReactNode, createContext, useContext } from 'react';

import { ReadonlyPropPath } from '../form/fields/document/DocumentEditor/component-blocks/utils';
import {
  AddToPathProvider,
  PathContextProvider,
  SlugFieldInfo,
  SlugFieldProvider,
} from '../form/fields/text/path-slug-context';
import {
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
import { FormatInfo } from './path-utils';
import { ScrollView } from './shell/primitives';
import { PageContainer } from './shell/page';
import { useContentPanelQuery } from './shell/context';

const emptyArray: ReadonlyPropPath = [];
const RESPONSIVE_PADDING = {
  mobile: 'medium',
  tablet: 'xlarge',
  desktop: 'xxlarge',
};

export function containerWidthForEntryLayout(
  config: Collection<any, any> | Singleton<any>
) {
  return config.entryLayout === 'content' ? 'none' : 'medium';
}

const EntryLayoutSplitPaneContext = createContext<'main' | 'side' | null>(null);
export function useEntryLayoutSplitPaneContext() {
  return useContext(EntryLayoutSplitPaneContext);
}

export function ResetEntryLayoutContext(props: { children: ReactNode }) {
  return (
    <EntryLayoutSplitPaneContext.Provider value={null}>
      {props.children}
    </EntryLayoutSplitPaneContext.Provider>
  );
}

export function FormForEntry({
  formatInfo,
  forceValidation,
  slugField,
  entryLayout,
  previewProps: props,
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
              <EntryLayoutSplitPaneContext.Provider value="main">
                <ScrollView>
                  <AddToPathProvider part={contentField.key}>
                    <InnerFormValueContentFromPreviewProps
                      forceValidation={forceValidation}
                      {...props.fields[contentField.key]}
                    />
                  </AddToPathProvider>
                </ScrollView>
              </EntryLayoutSplitPaneContext.Provider>
            </SplitPaneSecondary>
            <SplitPanePrimary>
              <EntryLayoutSplitPaneContext.Provider value="side">
                <ScrollView>
                  <Grid gap="xlarge" padding={RESPONSIVE_PADDING}>
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
              </EntryLayoutSplitPaneContext.Provider>
            </SplitPanePrimary>
          </SplitView>
        </SlugFieldProvider>
      </PathContextProvider>
    );
  }

  return (
    <ScrollView>
      <PageContainer paddingY={RESPONSIVE_PADDING}>
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
