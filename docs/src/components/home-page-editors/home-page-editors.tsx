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

  return (
    <>
      <div className="relative w-full h-[100vw] md:hidden">
        <img
          src="https://keystatic.io/images/keystatic-docs/hero-markdoc.png?width=787"
          srcSet="https://keystatic.io/images/keystatic-docs/hero-markdoc.png?width=787 1x,
            https://keystatic.io/images/keystatic-docs/hero-markdoc.png?width=1024 2x"
          alt="Content edited in a markdoc file, in a code editor"
          width={787}
          height={549}
          className="absolute max-w-none w-[110vw] -right-[40%] -top-[5%] md:hidden"
        />
        <img
          src="https://keystatic.io/images/keystatic-docs/hero-editor-current.png?width=787"
          srcSet="https://keystatic.io/images/keystatic-docs/hero-editor-current.png?width=787 1x,
            https://keystatic.io/images/keystatic-docs/hero-editor-current.png?width=1024 2x"
          alt="Content edited in a WYSIWIG editor in Keystatic Admin UI"
          width={787}
          height={549}
          className="absolute max-w-none w-[110vw] -right-[25%] -bottom-[5%] md:hidden"
        />
      </div>

      <VoussoirProvider>
        <div className="relative h-[31rem] w-[98vw] hidden md:block max-w-[85rem] z-0">
          <div
            className={
              'peer absolute top-0 xl:left-[3%] z-0 w-[32rem] lg:w-[42rem] animate-[sendCodeEditorToBack_0.15s_forwards_ease-in-out] focus-within:animate-[bringCodeEditorToFront_0.15s_forwards_ease-in-out]'
            }
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

          <div className="absolute top-0 right-0 z-1 w-[32rem] lg:w-[42rem] peer-focus-within:animate-[sendBrowserToBack_0.15s_forwards_ease-in-out] focus-within:animate-[bringBrowserToFront_0.15s_forwards_ease-in-out]">
            <BrowserChrome>
              <DocumentEditor
                style={{ height: '23rem' }}
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
    </>
  );
}
