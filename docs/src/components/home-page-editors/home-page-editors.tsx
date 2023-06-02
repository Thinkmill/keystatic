'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
import Markdoc from '@markdoc/markdoc';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { DocumentEditor } from '../../../../packages/keystatic/src/form/fields/document/DocumentEditor';
import { toMarkdocDocument } from '../../../../packages/keystatic/src/form/fields/document/markdoc/to-markdoc';
import { fromMarkdoc } from '../../../../packages/keystatic/src/form/fields/document/markdoc/from-markdoc';
import { VoussoirProvider } from '@voussoir/core';
import { Descendant } from 'slate';
import { BrowserChrome } from './browser-chrome';
import { CodeEditorChrome } from './code-editor-chrome';
import { componentBlocks } from './component-blocks';
import { normaliseDocumentFeatures } from '../../../../packages/keystatic/src/form/fields/document';
import { customNordTheme } from './custom-nord-theme';
import { cx } from '../../utils';

export const documentFeatures = normaliseDocumentFeatures({
  dividers: true,
  formatting: true,
  links: true,
  tables: true,
});

export function HomePageEditors({
  initialMarkdoc,
  ksEditorValue,
  setKsEditorValue,
}: {
  initialMarkdoc: string;
  ksEditorValue: Descendant[];
  setKsEditorValue: Dispatch<SetStateAction<Descendant[]>>;
}) {
  const [mdEditorValue, setMdEditorValue] = useState(initialMarkdoc);

  const mdEditorRef = useRef<ReactCodeMirrorRef>(null);

  const isMdEditorFocused = () =>
    typeof document !== 'undefined' &&
    document.activeElement === mdEditorRef.current?.view?.contentDOM;

  const convertToKsEditorValue = (markdocValue: string) => {
    if (!isMdEditorFocused()) return;
    const value = fromMarkdoc(Markdoc.parse(markdocValue), componentBlocks);

    setMdEditorValue(markdocValue);
    setKsEditorValue(value);
  };

  const convertToMdEditorValue = useCallback(
    (newEditorValue: Descendant[]) => {
      const markdocString = Markdoc.format(
        toMarkdocDocument(newEditorValue, {
          componentBlocks,
          documentFeatures,
          slug: undefined,
        }).node
      );

      setKsEditorValue(newEditorValue);
      setMdEditorValue(markdocString);
    },
    [setKsEditorValue]
  );

  // Prevent the Keystatic editor from re-rendering when it's focused
  const fixedKey = '1';

  const responsiveEditorClasses =
    'w-[80%] max-w-[38.4rem] lg:w-[60%] lg:max-w-[40.8rem] xl:max-w-[51%]';

  return (
    <VoussoirProvider>
      <div className="relative h-[41rem] w-[98vw] max-w-[85rem] z-0">
        <div
          className={cx(
            responsiveEditorClasses,
            'peer absolute top-0 left-0 z-0 animate-[sendCodeEditorToBack_0.15s_forwards_ease-in-out] focus-within:animate-[bringCodeEditorToFront_0.15s_forwards_ease-in-out]'
          )}
        >
          <CodeEditorChrome>
            <CodeMirror
              theme={customNordTheme}
              height="27.25rem"
              value={mdEditorValue}
              extensions={[
                EditorView.lineWrapping,
                markdown({
                  base: markdownLanguage,
                  codeLanguages: languages,
                }),
              ]}
              onChange={convertToKsEditorValue}
              ref={mdEditorRef}
            />
          </CodeEditorChrome>
        </div>

        <div
          className={cx(
            responsiveEditorClasses,
            'absolute top-0 right-0 z-1 peer-focus-within:animate-[sendBrowserToBack_0.15s_forwards_ease-in-out] focus-within:animate-[bringBrowserToFront_0.15s_forwards_ease-in-out]'
          )}
        >
          <BrowserChrome>
            <DocumentEditor
              style={{ height: '23rem', overflow: 'auto' }}
              documentFeatures={documentFeatures}
              componentBlocks={componentBlocks}
              value={ksEditorValue}
              onChange={convertToMdEditorValue}
              key={isMdEditorFocused() ? mdEditorValue.length : fixedKey}
            />
          </BrowserChrome>
        </div>
      </div>
    </VoussoirProvider>
  );
}
