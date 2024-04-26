import { getDefaultSrcSet } from '../utils';

type CloudImageProps = {
  src: string;
  alt?: string;
  height?: string | number;
  width?: string | number;
  srcSet?: string;
  sizes?: string;
  className?: string;
  caption?: string;
};

export function CloudImage({
  src,
  alt,
  sizes,
  height,
  width,
  srcSet,
  className,
  caption,
}: CloudImageProps) {
  return caption ? (
    <figure>
      <img
        alt={alt || ''}
        src={src}
        height={height}
        width={width}
        srcSet={srcSet || getDefaultSrcSet({ src })}
        sizes={sizes}
        className={className}
      />
      <figcaption className="mb-2 text-sm text-slate-9">{caption}</figcaption>
    </figure>
  ) : (
    <img
      alt={alt || ''}
      src={src}
      height={height}
      width={width}
      srcSet={srcSet || getDefaultSrcSet({ src })}
      sizes={sizes}
      className={className}
    />
  );
}
