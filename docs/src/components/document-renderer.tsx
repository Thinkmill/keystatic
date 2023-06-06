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
    theme: 'min-light',
  });

  return (
    <KeystaticRenderer
      document={document}
      renderers={getRenderers(slug, highlighter)}
      componentBlocks={componentBlockRenderers}
    />
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
        <a className="cursor-pointer underline hover:no-underline" href={href}>
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
      <p className="text-md text-keystatic-gray-dark" style={{ textAlign }}>
        {children}
      </p>
    ),
    code: ({ children, language }) => {
      let codeBlock = children;

      try {
        const tokens = highlighter.codeToThemedTokens(children, language);
        codeBlock = shiki.renderToHtml(tokens, {
          elements: {
            // Override shiki's <pre> so its default background color doesn't get applied
            pre({ children }) {
              return `<pre tabIndex="0">${children}</pre>`;
            },
          },
        });
      } catch (error) {
        console.error('Error highlighting codeblock', error);
      }

      return (
        <div
          className="[&>pre]:whitespace-break-spaces [&>pre]:break-all [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-keystatic-gray [&>pre]:bg-keystatic-gray-light text-sm my-2"
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
          <ol className="text-keystatic-gray-dark list-decimal list-inside mt-2">
            {children.map((child, index) => (
              <li key={index} className="mb-2 leading-tight">
                {child}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="text-keystatic-gray-dark list-disc ml-4 mt-2">
          {children.map((child, index) => (
            <li key={index} className="mb-2 leading-tight">
              {child}
            </li>
          ))}
        </ul>
      );
    },
    divider: () => {
      return <hr className="border-keystatic-gray my-2" />;
    },
    layout: ({ layout, children }) => (
      <div
        className="grid gap-6 my-2"
        style={{
          gridTemplateColumns: layout.map(x => `${x}fr`).join(' '),
        }}
      >
        {children.map((element, i) => (
          <div
            key={i}
            className="rounded-lg bg-keystatic-gray-light p-4 text-sm"
          >
            {element}
          </div>
        ))}
      </div>
    ),
  },
});

const componentBlockRenderers: InferRenderersForComponentBlocks<
  typeof componentBlocks
> = {
  aside: props => {
    return (
      <div className="flex flex-col sm:flex-row gap-4 rounded-lg bg-keystatic-gray-light px-4 py-6 my-2">
        <div className="flex text-3xl h-6 items-center">{props.icon}</div>
        <div className="flex flex-col gap-3">{props.content}</div>
      </div>
    );
  },
  'cloud-image': ({ href: src, alt, sizes, height, width, srcSet }) => {
    const imgMaxWidthPx = `${parseFloat(CONTENT_MAX_WIDTH_DESKTOP) * 16}`;

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
  tags: ({ tags }) => {
    return (
      <div className="flex gap-2">
        {tags.map((tag, index) => (
          <div
            className={`${getTagClasses(
              index
            )} rounded-full px-2 py-1 font-medium text-[0.6875rem] leading-none uppercase self-start inline`}
          >
            {tag}
          </div>
        ))}
      </div>
    );
  },
};

const getTagClasses = (index: number) => {
  switch (index) {
    case 0:
      return 'bg-indigo-100 text-indigo-800/80';
    case 1:
      return 'bg-amber-100 text-amber-800/80';
    default:
      return 'bg-fuchsia-100 text-fuchsia-800/80';
  }
};
