'use client';

import { useState } from 'react';
import { ProgressCircle } from '@voussoir/progress';
import { getDefaultSrcSet } from '../../utils';
import { CONTENT_MAX_WIDTH_DESKTOP } from '../../constants';

export function CloudImagePreview(props: any) {
  const src = props.fields.href.value;
  const alt = props.fields.alt.value;
  const sizes = props.fields.sizes.value;
  const srcSet = props.fields.srcSet.value;
  const height = props.fields.height.value;
  const width = props.fields.width.value;

  const [isLoading, setIsLoading] = useState(!!src);

  return (
    <>
      <p>Href: {src}</p>
      <p>Alt text: {alt}</p>
      {height && <p>Height: {height}</p>}
      {width && <p>Width: {width}</p>}

      {isLoading && <ProgressCircle aria-label="Loading…" isIndeterminate />}
      <img
        alt={alt}
        src={src}
        height={height}
        width={width}
        srcSet={srcSet || getDefaultSrcSet({ src })}
        sizes={sizes || `${parseInt(CONTENT_MAX_WIDTH_DESKTOP) * 16}px`}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}
