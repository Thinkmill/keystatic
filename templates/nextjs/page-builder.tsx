import { ReactNode } from 'react';
import { component, fields } from '@itgkey/core';

const pageBuilderAssetDirectories = {
  files: {
    directory: 'public/page-builder/files',
    publicPath: '/page-builder/files/',
  },
  images: {
    directory: 'public/page-builder/images',
    publicPath: '/page-builder/images/',
  },
  videos: {
    directory: 'public/page-builder/videos',
    publicPath: '/page-builder/videos/',
  },
} as const;

export function normalizePageSlug(slug: string) {
  return slug
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

export function getPageSlug(
  slug: string | { name?: string; slug: string } | null | undefined
) {
  if (!slug) {
    return '';
  }
  return typeof slug === 'string' ? slug : slug.slug;
}

export const pageBuilderComponents = {
  section: component({
    label: 'Section',
    schema: {
      title: fields.text({ label: 'Section title' }),
      content: fields.child({
        kind: 'block',
        formatting: 'inherit',
        componentBlocks: 'inherit',
        placeholder: 'Write section content...',
      }),
    },
    preview: () => null,
  }),
  hero: component({
    label: 'Hero',
    schema: {
      title: fields.text({ label: 'Title' }),
      subtitle: fields.text({ label: 'Subtitle', multiline: true }),
      image: fields.image({
        label: 'Hero image',
        ...pageBuilderAssetDirectories.images,
      }),
      cta: fields.text({ label: 'CTA button text' }),
    },
    preview: () => null,
  }),
  features: component({
    label: 'Features',
    schema: {
      title: fields.text({ label: 'Section title' }),
      features: fields.array(
        fields.object({
          name: fields.text({ label: 'Feature name' }),
          description: fields.text({ label: 'Description' }),
          icon: fields.image({
            label: 'Icon',
            ...pageBuilderAssetDirectories.images,
          }),
        }),
        { label: 'Features' }
      ),
    },
    preview: () => null,
  }),
  gallery: component({
    label: 'Gallery',
    schema: {
      title: fields.text({ label: 'Gallery title' }),
      images: fields.array(
        fields.object({
          image: fields.image({
            label: 'Image',
            ...pageBuilderAssetDirectories.images,
          }),
          alt: fields.text({ label: 'Alt text' }),
        }),
        { label: 'Images' }
      ),
    },
    preview: () => null,
  }),
  imageBlock: component({
    label: 'Image',
    schema: {
      image: fields.image({
        label: 'Image',
        ...pageBuilderAssetDirectories.images,
      }),
      alt: fields.text({ label: 'Alt text' }),
      caption: fields.text({ label: 'Caption', multiline: true }),
    },
    preview: () => null,
  }),
  videoBlock: component({
    label: 'Video',
    schema: {
      video: fields.file({
        label: 'Video file',
        ...pageBuilderAssetDirectories.videos,
      }),
      poster: fields.image({
        label: 'Poster image',
        ...pageBuilderAssetDirectories.images,
      }),
      caption: fields.text({ label: 'Caption', multiline: true }),
    },
    preview: () => null,
  }),
  fileBlock: component({
    label: 'File',
    schema: {
      file: fields.file({
        label: 'File',
        ...pageBuilderAssetDirectories.files,
      }),
      label: fields.text({ label: 'Link label' }),
      description: fields.text({ label: 'Description', multiline: true }),
    },
    preview: () => null,
  }),
  textBlock: component({
    label: 'Text',
    schema: {
      text: fields.child({
        kind: 'block',
        formatting: 'inherit',
        placeholder: 'Write text...',
      }),
    },
    preview: () => null,
  }),
  imageWithText: component({
    label: 'Image With Text',
    schema: {
      title: fields.text({ label: 'Title' }),
      image: fields.image({
        label: 'Image',
        ...pageBuilderAssetDirectories.images,
      }),
      alt: fields.text({ label: 'Alt text' }),
      content: fields.child({
        kind: 'block',
        formatting: 'inherit',
        placeholder: 'Write text next to the image...',
      }),
      imagePosition: fields.select({
        label: 'Image position',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
        ],
        defaultValue: 'left',
      }),
    },
    preview: () => null,
  }),
  videoHeader: component({
    label: 'Video Header',
    schema: {
      title: fields.text({ label: 'Title' }),
      subtitle: fields.text({ label: 'Subtitle', multiline: true }),
      video: fields.file({
        label: 'Video',
        ...pageBuilderAssetDirectories.videos,
      }),
      poster: fields.image({
        label: 'Poster image',
        ...pageBuilderAssetDirectories.images,
      }),
    },
    preview: () => null,
  }),
  contentBlock: component({
    label: 'Content',
    schema: {
      eyebrow: fields.text({ label: 'Eyebrow' }),
      heading: fields.text({ label: 'Heading' }),
      body: fields.child({
        kind: 'block',
        formatting: 'inherit',
        placeholder: 'Write your content...',
      }),
    },
    preview: () => null,
  }),
  callToAction: component({
    label: 'Call to Action',
    schema: {
      text: fields.text({ label: 'Text', multiline: true }),
      buttonLabel: fields.text({ label: 'Button label' }),
      buttonHref: fields.text({ label: 'Button link' }),
    },
    preview: () => null,
  }),
};

export const pageBuilderRenderers = {
  callToAction: (props: {
    buttonHref?: string;
    buttonLabel?: string;
    text?: string;
  }) => (
    <section
      style={{
        margin: '24px 0',
        padding: '24px',
        borderRadius: 20,
        border: '1px solid #bfdbfe',
        background:
          'linear-gradient(135deg, rgba(239,246,255,1) 0%, rgba(219,234,254,0.92) 100%)',
      }}
    >
      <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.8 }}>
        {props.text}
      </p>
      {props.buttonLabel ? (
        <a
          href={props.buttonHref || '#'}
          style={{
            display: 'inline-flex',
            marginTop: 16,
            padding: '12px 18px',
            borderRadius: 999,
            background: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {props.buttonLabel}
        </a>
      ) : null}
    </section>
  ),
  features: (props: {
    features?: { description?: string; icon?: string; name?: string }[];
    title?: string;
  }) => (
    <section style={{ margin: '32px 0' }}>
      {props.title ? <h2>{props.title}</h2> : null}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {(props.features || []).map((feature, index) => (
          <article
            key={`${feature.name ?? 'feature'}-${index}`}
            style={{
              padding: 18,
              borderRadius: 16,
              border: '1px solid #dbeafe',
              background: '#fff',
              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
            }}
          >
            {feature.icon ? (
              <img
                src={feature.icon}
                alt=""
                style={{
                  width: 48,
                  height: 48,
                  objectFit: 'cover',
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              />
            ) : null}
            {feature.name ? (
              <h3 style={{ marginTop: 0 }}>{feature.name}</h3>
            ) : null}
            {feature.description ? (
              <p style={{ marginBottom: 0 }}>{feature.description}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  ),
  fileBlock: (props: {
    description?: string;
    file?: string;
    label?: string;
  }) => (
    <section
      style={{
        margin: '24px 0',
        padding: 18,
        borderRadius: 16,
        border: '1px solid #dbeafe',
        background: '#f8fbff',
      }}
    >
      <a
        href={props.file}
        style={{
          fontWeight: 700,
          color: '#1d4ed8',
          textDecoration: 'none',
        }}
      >
        {props.label || 'Download file'}
      </a>
      {props.description ? (
        <p style={{ marginBottom: 0, marginTop: 8 }}>{props.description}</p>
      ) : null}
    </section>
  ),
  gallery: (props: {
    images?: { alt?: string; image?: string }[];
    title?: string;
  }) => (
    <section style={{ margin: '32px 0' }}>
      {props.title ? <h2>{props.title}</h2> : null}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
        }}
      >
        {(props.images || []).map((item, index) => (
          <figure
            key={`${item.image ?? 'image'}-${index}`}
            style={{ margin: 0 }}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.alt || ''}
                style={{
                  width: '100%',
                  height: 220,
                  objectFit: 'cover',
                  borderRadius: 18,
                }}
              />
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  ),
  hero: (props: {
    cta?: string;
    image?: string;
    subtitle?: string;
    title?: string;
  }) => (
    <section
      style={{
        margin: '24px 0 40px',
        padding: 28,
        borderRadius: 28,
        background:
          'linear-gradient(135deg, rgba(239,246,255,1) 0%, rgba(220,252,231,0.8) 100%)',
        border: '1px solid #dbeafe',
      }}
    >
      {props.image ? (
        <img
          src={props.image}
          alt={props.title || ''}
          style={{
            width: '100%',
            maxHeight: 420,
            objectFit: 'cover',
            borderRadius: 20,
            marginBottom: 24,
          }}
        />
      ) : null}
      {props.title ? (
        <h2 style={{ fontSize: '2.4rem' }}>{props.title}</h2>
      ) : null}
      {props.subtitle ? (
        <p style={{ fontSize: '1.1rem', maxWidth: 700 }}>{props.subtitle}</p>
      ) : null}
      {props.cta ? (
        <div
          style={{
            display: 'inline-flex',
            marginTop: 16,
            padding: '12px 18px',
            borderRadius: 999,
            background: '#0f172a',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          {props.cta}
        </div>
      ) : null}
    </section>
  ),
  imageBlock: (props: { alt?: string; caption?: string; image?: string }) => (
    <figure style={{ margin: '28px 0' }}>
      {props.image ? (
        <img
          src={props.image}
          alt={props.alt || ''}
          style={{ width: '100%', borderRadius: 20, objectFit: 'cover' }}
        />
      ) : null}
      {props.caption ? (
        <figcaption
          style={{ marginTop: 10, color: '#475569', fontSize: '0.95rem' }}
        >
          {props.caption}
        </figcaption>
      ) : null}
    </figure>
  ),
  textBlock: (props: { text?: ReactNode }) => (
    <section
      style={{
        margin: '24px 0',
        padding: '20px 22px',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        background: '#ffffff',
      }}
    >
      <div style={{ lineHeight: 1.8 }}>{props.text}</div>
    </section>
  ),
  imageWithText: (props: {
    alt?: string;
    content?: ReactNode;
    image?: string;
    imagePosition?: 'left' | 'right';
    title?: string;
  }) => (
    <section
      style={{
        margin: '28px 0',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        alignItems: 'center',
      }}
    >
      <div style={{ order: props.imagePosition === 'right' ? 2 : 1 }}>
        {props.image ? (
          <img
            src={props.image}
            alt={props.alt || ''}
            style={{ width: '100%', borderRadius: 20, objectFit: 'cover' }}
          />
        ) : null}
      </div>
      <div style={{ order: props.imagePosition === 'right' ? 1 : 2 }}>
        {props.title ? <h2>{props.title}</h2> : null}
        <div style={{ lineHeight: 1.8 }}>{props.content}</div>
      </div>
    </section>
  ),
  videoHeader: (props: {
    poster?: string;
    subtitle?: string;
    title?: string;
    video?: string;
  }) => (
    <section style={{ margin: '24px 0 36px' }}>
      {props.video ? (
        <video
          controls
          poster={props.poster || undefined}
          src={props.video}
          style={{
            width: '100%',
            borderRadius: 22,
            background: '#020617',
            marginBottom: 18,
          }}
        />
      ) : null}
      {props.title ? <h2>{props.title}</h2> : null}
      {props.subtitle ? (
        <p style={{ marginBottom: 0, color: '#475569', lineHeight: 1.8 }}>
          {props.subtitle}
        </p>
      ) : null}
    </section>
  ),
  contentBlock: (props: {
    body?: ReactNode;
    eyebrow?: string;
    heading?: string;
  }) => (
    <section
      style={{
        margin: '24px 0',
        padding: '22px 24px',
        borderRadius: 18,
        border: '1px solid #e2e8f0',
        background: '#fff',
      }}
    >
      {props.eyebrow ? (
        <p
          style={{
            margin: '0 0 10px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontSize: 12,
            color: '#64748b',
          }}
        >
          {props.eyebrow}
        </p>
      ) : null}
      {props.heading ? <h2>{props.heading}</h2> : null}
      <div style={{ lineHeight: 1.8 }}>{props.body}</div>
    </section>
  ),
  section: (props: { content?: ReactNode; title?: string }) => (
    <section
      style={{
        margin: '24px 0',
        padding: '22px 24px',
        borderRadius: 20,
        border: '1px solid #e2e8f0',
        background: '#fff',
      }}
    >
      {props.title ? <h2>{props.title}</h2> : null}
      <div>{props.content}</div>
    </section>
  ),
  videoBlock: (props: {
    caption?: string;
    poster?: string;
    video?: string;
  }) => (
    <figure style={{ margin: '28px 0' }}>
      {props.video ? (
        <video
          controls
          poster={props.poster || undefined}
          src={props.video}
          style={{
            width: '100%',
            borderRadius: 20,
            background: '#020617',
          }}
        />
      ) : null}
      {props.caption ? (
        <figcaption
          style={{ marginTop: 10, color: '#475569', fontSize: '0.95rem' }}
        >
          {props.caption}
        </figcaption>
      ) : null}
    </figure>
  ),
};

