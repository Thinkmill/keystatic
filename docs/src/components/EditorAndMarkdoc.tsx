'use client';
import { DocumentEditor } from '../../../packages/keystatic/src/form/fields/document/DocumentEditor';
import { useState } from 'react';
import Markdoc from '@markdoc/markdoc';
import { toMarkdocDocument } from '../../../packages/keystatic/src/form/fields/document/markdoc/to-markdoc';
import { fromMarkdoc } from '../../../packages/keystatic/src/form/fields/document/markdoc/from-markdoc';
import { normaliseDocumentFeatures } from '../../../packages/keystatic/src/form/fields/document';
import { VoussoirProvider } from '@voussoir/core';

const markdoc = `

whatever content

# heading
`;

export const documentFeatures = normaliseDocumentFeatures({
  dividers: true,
  formatting: true,
  images: true,
  links: true,
  tables: true,
});

const componentBlocks = {};

const initial = fromMarkdoc(Markdoc.parse(markdoc), {});

export function EditorAndMarkdoc() {
  const [value, onChange] = useState(initial);
  return (
    // this should probably be used RootVoussoirProvider in the right place
    // + needs to deal with tailwind messing stuff up
    <VoussoirProvider>
      <div>
        <pre>
          <code>
            {
              // TODO for later: this should be two-way editing, but that would be problematic right now for Reasons.
              Markdoc.format(
                Markdoc.parse(
                  Markdoc.format(
                    toMarkdocDocument(value, {
                      componentBlocks,
                      documentFeatures,
                      slug: undefined,
                    }).node
                  )
                )
              )
            }
          </code>
        </pre>
        <DocumentEditor
          documentFeatures={documentFeatures}
          componentBlocks={componentBlocks}
          value={value}
          onChange={onChange}
        />
      </div>
    </VoussoirProvider>
  );
}
