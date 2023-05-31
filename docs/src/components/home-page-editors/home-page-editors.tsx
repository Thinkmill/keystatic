'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Markdoc from '@markdoc/markdoc';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { nord } from '@uiw/codemirror-theme-nord';
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
import { initialMarkdoc } from './editable-hero';
import { normaliseDocumentFeatures } from '../../../../packages/keystatic/src/form/fields/document';

export const documentFeatures = normaliseDocumentFeatures({
  dividers: true,
  formatting: true,
  images: true,
  links: true,
  tables: true,
});

export function HomePageEditors({
  editorValue,
  setEditorValue,
}: {
  editorValue: Descendant[];
  setEditorValue: Dispatch<SetStateAction<Descendant[]>>;
}) {
  const [mdEditorValue, setMdEditorValue] = useState(initialMarkdoc);
  const [hasFocusedMdEditor, setHasFocusedMdEditor] = useState<
    boolean | undefined
  >(undefined);

  const mdEditorRef = useRef<ReactCodeMirrorRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let options = {
      root: null,
      rootMargin: '0px',
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          mdEditorRef.current?.view?.contentDOM.blur();
          setHasFocusedMdEditor(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(container);

    return () => {
      observer.unobserve(container);
    };
  }, []);

  const isMdEditorFocused = () =>
    typeof document !== 'undefined' &&
    document.activeElement === mdEditorRef.current?.view?.contentDOM;

  const convertToKsEditorValue = (markdocValue: string) => {
    if (!isMdEditorFocused()) return;
    const value = fromMarkdoc(Markdoc.parse(markdocValue), componentBlocks);

    setMdEditorValue(markdocValue);
    setEditorValue(value);
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

      setEditorValue(newEditorValue);
      setMdEditorValue(markdocString);
    },
    [setEditorValue]
  );

  // Prevent the Keystatic editor from re-rendering when it's focused
  const fixedKey = '1';

  // TODO: this needs to deal with tailwind messing stuff up
  return (
    <VoussoirProvider ref={containerRef}>
      <div
        onAnimationEnd={event => {
          if (event.animationName === 'bringToFront') {
            setHasFocusedMdEditor(true);
          }
        }}
        className="relative h-152 w-340 z-0"
      >
        <div
          className={`absolute top-0 left-0 z-0 ${
            hasFocusedMdEditor
              ? ''
              : 'animate-[sendToBack_0.4s_forwards_ease-in-out] focus-within:animate-[bringToFront_0.4s_forwards_ease-in-out]'
          }`}
        >
          <CodeEditorChrome>
            <CodeMirror
              theme={nord}
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

        <div className="absolute top-0 right-0 z-1">
          <BrowserChrome>
            <DocumentEditor
              documentFeatures={documentFeatures}
              componentBlocks={componentBlocks}
              value={editorValue}
              onChange={convertToMdEditorValue}
              key={isMdEditorFocused() ? mdEditorValue.length : fixedKey}
            />
          </BrowserChrome>
        </div>
      </div>
    </VoussoirProvider>
  );
}
