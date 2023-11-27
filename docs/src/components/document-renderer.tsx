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
import { TextFieldDemo } from './fields/text';
import { URLFieldDemo } from './fields/url';
import { SelectFieldDemo } from './fields/select';
import { MultiselectFieldDemo } from './fields/multiselect';
import { IntegerFieldDemo } from './fields/integer';
import { DateFieldDemo } from './fields/date';
import { SlugFieldDemo } from './fields/slug';
import { ImageFieldDemo } from './fields/image';
import { FileFieldDemo } from './fields/file';
import { Embed, EmbedProps } from './embed';
import Link from 'next/link';
import { DatetimeFieldDemo } from './fields/datetime';
import keystaticCodeTheme from '../styles/keystatic-theme.json';
import { draftMode } from 'next/headers';

export default async function DocumentRenderer({
  document,
}: DocumentRendererProps) {
  const { isEnabled } = draftMode();
  const highlighter = isEnabled
    ? undefined
    : await shiki.getHighlighter({
        theme: keystaticCodeTheme as any,
      });

  return (
    <KeystaticRenderer
      document={document}
      renderers={getRenderers(highlighter)}
      componentBlocks={componentBlockRenderers}
    />
  );
}

const getRenderers = (
  highlighter: shiki.Highlighter | undefined
): DocumentRendererProps['renderers'] => ({
  inline: {
    bold: ({ children }) => <strong>{children}</strong>,
    code: ({ children }) => (
      <code className="rounded-md border border-slate-5 bg-slate-3 px-1 py-0.5 font-mono text-sm text-black">
        {children}
      </code>
    ),
    link: ({ href, children }) => {
      return (
        <Link
          className="cursor-pointer font-medium underline hover:no-underline"
          href={href}
        >
          {children}
        </Link>
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
      <p className="text-md text-slate-12" style={{ textAlign }}>
        {children}
      </p>
    ),
    code: ({ children, language }) => {
      let codeBlock = children;
      if (!highlighter) {
        return (
          <div className="my-2 text-sm [&>pre]:whitespace-break-spaces [&>pre]:break-all [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-slate-5 [&>pre]:bg-white [&>pre]:px-6 [&>pre]:py-4">
            <pre>{codeBlock}</pre>
          </div>
        );
      }
      try {
        const tokens = highlighter.codeToThemedTokens(children, language);
        codeBlock = shiki.renderToHtml(tokens, {
          elements: {
            // Exclude diff indicators ("+" & "-") from selection; makes it easier to copy/paste.
            token({ style, children, token }) {
              let content = `${children}`;
              let firstChar = token.content[0];
              let isDiff = token.explanation?.some(e =>
                e.scopes.some(s => s.scopeName.includes('diff'))
              );
              if (isDiff && (firstChar === '+' || firstChar === '-')) {
                let diffIndicator = `<span class="absolute select-none">${firstChar}</span>`;
                content = `${diffIndicator} ${content.slice(1)}`;
              }
              return `<span style="${style}">${content}</span>`;
            },
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
          className="my-2 text-sm [&>pre]:whitespace-break-spaces [&>pre]:break-all [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-slate-5 [&>pre]:bg-white [&>pre]:px-6 [&>pre]:py-4"
          dangerouslySetInnerHTML={{ __html: codeBlock }}
        />
      );
    },
    list: ({ type, children }) => {
      if (type === 'ordered') {
        return (
          <ol className="mt-2 list-inside list-decimal text-slate-11">
            {children.map((child, index) => (
              <li key={index} className="mb-2">
                {child}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="ml-4 mt-2 list-disc text-slate-11">
          {children.map((child, index) => (
            <li key={index} className="mb-2">
              {child}
            </li>
          ))}
        </ul>
      );
    },
    divider: () => {
      return <hr className="peer my-8 border-slate-5" />;
    },
    layout: ({ children }) => {
      return (
        <div className="my-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {children.map((element, index) => (
            <div key={index} className="rounded-lg bg-slate-3 p-4 text-sm">
              {element}
            </div>
          ))}
        </div>
      );
    },
  },
});

const componentBlockRenderers: InferRenderersForComponentBlocks<
  typeof componentBlocks
> = {
  aside: props => {
    return (
      <div className="not-prose my-2 flex flex-col gap-4 rounded-lg bg-slate-3 px-4 py-6 sm:flex-row">
        <div className="flex h-6 items-center text-3xl">{props.icon}</div>
        <div className="flex flex-col gap-3">{props.content}</div>
      </div>
    );
  },
  'cloud-image': ({ src, alt, height, width }) => {
    const imgMaxWidthPx = `${parseFloat(CONTENT_MAX_WIDTH_DESKTOP) * 16}`;

    return (
      <CloudImage
        alt={alt}
        src={src}
        height={height ?? undefined}
        width={width ?? imgMaxWidthPx}
        className="my-2 rounded-lg"
      />
    );
  },
  tags: ({ tags }) => {
    return (
      <div className="flex gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className={`${getTagClasses(
              index
            )} inline self-start rounded-full px-2 py-1 text-[0.6875rem] font-medium uppercase leading-none`}
          >
            {tag}
          </div>
        ))}
      </div>
    );
  },
  'field-demo': ({ field }) => {
    switch (field) {
      case 'text':
        return <TextFieldDemo />;
      case 'url':
        return <URLFieldDemo />;
      case 'select':
        return <SelectFieldDemo />;
      case 'multiselect':
        return <MultiselectFieldDemo />;
      case 'integer':
        return <IntegerFieldDemo />;
      case 'date':
        return <DateFieldDemo />;
      case 'datetime':
        return <DatetimeFieldDemo />;
      case 'slug':
        return <SlugFieldDemo />;
      case 'image':
        return <ImageFieldDemo />;
      case 'file':
        return <FileFieldDemo />;

      default:
        return <div>Field not found</div>;
    }
  },
  embed: ({ mediaType, embedCode }) => {
    return (
      <Embed
        mediaType={mediaType as EmbedProps['mediaType']}
        embedCode={embedCode}
      />
    );
  },
};

const getTagClasses = (index: number) => {
  switch (index) {
    case 0:
      return 'bg-purple-2 text-purple-11 border border-purple-5';
    case 1:
      return 'bg-amber-2 text-amber-11 border border-amber-5';
    default:
      return 'bg-green-2 text-green-11 border border-green-5';
  }
};
