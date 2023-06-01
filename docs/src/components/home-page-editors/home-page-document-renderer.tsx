import {
  DocumentRenderer as KeystaticRenderer,
  DocumentRendererProps,
} from '@keystatic/core/renderer';
import Heading from '../heading';
import { componentBlockRenderers } from './component-blocks';

export function HomePageDocumentRenderer({ document }: DocumentRendererProps) {
  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-8 text-center">
      <KeystaticRenderer
        document={document}
        renderers={renderers}
        componentBlocks={componentBlockRenderers}
      />
    </div>
  );
}

const renderers: DocumentRendererProps['renderers'] = {
  block: {
    heading: ({ level, children }) => (
      <Heading level={level}>{children}</Heading>
    ),

    paragraph: ({ children, textAlign }) => (
      <p className="text-lg text-keystatic-gray-dark" style={{ textAlign }}>
        {children}
      </p>
    ),
  },
  inline: {
    bold: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
  },
};
