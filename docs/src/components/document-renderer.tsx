import {
  DocumentRenderer as KeystaticRenderer,
  DocumentRendererProps,
} from '@keystatic/core/renderer';
import shiki from 'shiki';
import Heading from './heading';

const getRenderers = (
  slug: string,
  highlighter: shiki.Highlighter
): DocumentRendererProps['renderers'] => ({
  // use your editor's autocomplete to see what other renderers you can override
  inline: {
    bold: ({ children }) => {
      return <strong>{children}</strong>;
    },
    code: ({ children }) => {
      return (
        <code className="font-mono bg-gray-200 text-sm p-1 rounded-md">
          {children}
        </code>
      );
    },
  },
  block: {
    heading: ({ level, children }) => {
      return <Heading level={level}>{children}</Heading>;
    },
    paragraph: ({ children, textAlign }) => {
      return (
        <p className="text-md text-stone-700" style={{ textAlign }}>
          {children}
        </p>
      );
    },
    code: ({ children, language }) => {
      let codeBlock = children;
      try {
        codeBlock = highlighter.codeToHtml(children, { lang: language });
      } catch (error) {
        console.error('Error highlighting codeblock', error);
      }
      return (
        <code
          className="[&>pre]:p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: codeBlock }}
        />
      );
    },
    image: ({ src, alt }) => (
      <img
        className="rounded-md"
        src={`/images/content/${slug}/${src}`}
        alt={alt}
      />
    ),
  },
});

export default async function DocumentRenderer({
  slug,
  document,
}: DocumentRendererProps & { slug: string }) {
  const hightlighter = await shiki.getHighlighter({
    theme: 'material-theme-lighter',
  });

  return (
    <div className="flex flex-col gap-4">
      <KeystaticRenderer
        document={document}
        renderers={getRenderers(slug, hightlighter)}
      />
    </div>
  );
}
