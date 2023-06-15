'use client';

import { FrameComponent } from './frame';
import { DocumentFieldInput } from '../../../../packages/keystatic/src/form/fields/document/ui';
import { normaliseDocumentFeatures } from '../../../../packages/keystatic/src/form/fields/document';
import { useState } from 'react';
import { fromMarkdoc } from '../../../../packages/keystatic/src/form/fields/document/markdoc/from-markdoc';
import Markdoc from '@markdoc/markdoc';
import { DocumentRendererProps } from '@keystatic/core/renderer';

const documentFeatures = normaliseDocumentFeatures({
  dividers: true,
  formatting: true,
  links: true,
  tables: true,
});

export const DocumentField = () => {
  const componentBlocks = {};

  const [ksEditorValue, setKsEditorValue] = useState(
    fromMarkdoc(Markdoc.parse(''), componentBlocks)
  );

  return (
    <FrameComponent>
      <div className="max-w-content-desktop">
        <DocumentFieldInput
          description={undefined}
          label="Label"
          value={ksEditorValue as unknown as DocumentRendererProps['document']}
          onChange={setKsEditorValue}
          autoFocus={false}
          forceValidation={false}
          componentBlocks={componentBlocks}
          documentFeatures={documentFeatures}
        />
      </div>
    </FrameComponent>
  );
};
