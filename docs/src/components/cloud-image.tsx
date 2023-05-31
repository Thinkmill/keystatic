import { getDefaultSrcSet } from '../utils';

type CloudImageProps = {
  src: string;
  alt?: string;
  height?: string | number;
  width?: string | number;
  srcSet?: string;
  sizes?: string;
  className?: string;
};

export default function CloudImage({
  src,
  alt,
  sizes,
  height,
  width,
  srcSet,
  className,
}: CloudImageProps) {
  return (
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
