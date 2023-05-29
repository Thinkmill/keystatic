import {
  DocumentRenderer as KeystaticRenderer,
  DocumentRendererProps,
} from '@keystatic/core/renderer';
import shiki from 'shiki';
import Heading from './heading';
import { InferRenderersForComponentBlocks } from '@keystatic/core';
import { componentBlocks } from '../../keystatic.config';
import { CONTENT_MAX_WIDTH_DESKTOP } from '../constants';
import CloudImage from './cloud-image';

export default async function DocumentRenderer({
  slug,
  document,
}: DocumentRendererProps & { slug: string }) {
  const highlighter = await shiki.getHighlighter({
    theme: 'material-theme-lighter',
  });

  return (
    <div className="flex flex-col gap-4">
      <KeystaticRenderer
        document={document}
        renderers={getRenderers(slug, highlighter)}
        componentBlocks={componentBlockRenderers}
      />
    </div>
  );
}

const getRenderers = (
  slug: string,
  highlighter: shiki.Highlighter
): DocumentRendererProps['renderers'] => ({
  inline: {
    bold: ({ children }) => <strong>{children}</strong>,
    code: ({ children }) => (
      <code className="font-mono bg-neutral-100 text-sm text-black px-1 py-0.5 rounded-md border border-neutral-200">
        {children}
      </code>
    ),
    link: ({ href, children }) => {
      return (
        <a
          className="cursor-pointer underline hover:text-thinkmill-red" // TODO
          href={href}
        >
          {children}
        </a>
      );
    },
  },
  block: {
    heading: ({ level, children }) => (
      <Heading level={level} anchor>
        {children}
      </Heading>
    ),

    paragraph: ({ children, textAlign }) => (
      <p className="text-md text-neutral-700" style={{ textAlign }}>
        {children}
      </p>
    ),
    code: ({ children, language }) => {
      let codeBlock = children;
      try {
        codeBlock = highlighter.codeToHtml(children, { lang: language });
      } catch (error) {
        console.error('Error highlighting codeblock', error);
      }
      return (
        <code
          className="[&>pre]:whitespace-break-spaces [&>pre]:break-all [&>pre]:p-4 [&>pre]:rounded-lg text-sm my-2"
          dangerouslySetInnerHTML={{ __html: codeBlock }}
        />
      );
    },
    image: ({ src, alt }) => (
      <img
        className="rounded-lg my-2"
        src={`/images/content/${slug}/${src}`}
        alt={alt}
      />
    ),
    list: ({ type, children }) => {
      if (type === 'ordered') {
        return (
          <ol className="list-decimal">
            {children.map((child, index) => (
              <li key={index}>{child}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="list-disc ml-4">
          {children.map((child, index) => (
            <li key={index}>{child}</li>
          ))}
        </ul>
      );
    },
  },
});

const componentBlockRenderers: InferRenderersForComponentBlocks<
  typeof componentBlocks
> = {
  aside: props => {
    return (
      <div className="flex gap-3 rounded-lg bg-keystatic-gray-light border border-keystatic-gray px-4 py-4 my-2">
        <div className="text-2xl" aria-hidden="true">
          {props.icon}
        </div>
        <div className="flex flex-col gap-3 py-2">{props.content}</div>
      </div>
    );
  },
  'cloud-image': ({ href: src, alt, sizes, height, width, srcSet }) => {
    const imgMaxWidthPx = `${parseInt(CONTENT_MAX_WIDTH_DESKTOP) * 16}`;

    return (
      <CloudImage
        alt={alt}
        src={src}
        height={height}
        width={width ?? imgMaxWidthPx}
        srcSet={srcSet}
        sizes={sizes || `(max-width: 375px) 375px, ${imgMaxWidthPx}px`}
        className="rounded-lg my-2"
      />
    );
  },
};
