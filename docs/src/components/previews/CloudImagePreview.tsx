'use client';

import { useState } from 'react';
import { ProgressCircle } from '@keystar/ui/progress';
import { getDefaultSrcSet } from '../../utils';
import { CONTENT_MAX_WIDTH_DESKTOP } from '../../constants';

export function CloudImagePreview(props: any) {
  const src = props.fields.href.value;
  const alt = props.fields.alt.value;
  const sizes = props.fields.sizes.value;
  const srcSet = props.fields.srcSet.value;
  const height = props.fields.height.value;
  const width = props.fields.width.value;
  const caption = props.fields.caption.value;

  const [isLoading, setIsLoading] = useState(!!src);

  return (
    <>
      {height &&
        (isNaN(Number(height)) ? (
          <p style={{ color: 'red' }}>
            Invalid height, please enter an integer, e.g. 100
          </p>
        ) : (
          <p>Height: {height}</p>
        ))}
      {width &&
        (isNaN(Number(width)) ? (
          <p style={{ color: 'red' }}>
            Invalid width, please enter an integer, e.g. 100
          </p>
        ) : (
          <p>Width: {width}</p>
        ))}

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
      <p style={{ margin: '0' }}>Href: {src}</p>
      <p style={{ margin: '0' }}>Alt text: {alt}</p>
      {caption && <p style={{ margin: '0' }}>Caption: {caption}</p>}
    </>
  );
}
