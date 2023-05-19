'use client';

import { useState } from 'react';
import { ProgressCircle } from '@voussoir/progress';
import { getDefaultSrcSet } from '../../utils';
import { CONTENT_MAX_WIDTH_DESKTOP } from '../../constants';

export function CloudImagePreview(props: any) {
  const src = props.fields.href.value;
  const alt = props.fields.alt.value;
  const sizes = props.fields.sizes.value;

  const [isLoading, setIsLoading] = useState(!!src);

  return (
    <>
      <p>Href: {src}</p>
      <p>Alt text: {alt}</p>

      {isLoading && <ProgressCircle aria-label="Loading…" isIndeterminate />}
      <img
        alt={alt}
        src={src}
        srcSet={getDefaultSrcSet({ src })}
        sizes={sizes || `${parseInt(CONTENT_MAX_WIDTH_DESKTOP) * 16}px`}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}
