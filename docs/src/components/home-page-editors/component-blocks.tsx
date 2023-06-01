import {
  InferRenderersForComponentBlocks,
  component,
  fields,
} from '@keystatic/core';
import { PreviewHeading1 } from './preview-heading-1';
import { Heading1 } from './heading-1';

export const componentBlocks = {
  'hilight-heading': component({
    preview: PreviewHeading1,
    label: 'Hilight heading',
    schema: {
      plainLine1: fields.child({
        kind: 'block',
        placeholder: 'Plain text line 1...',
        formatting: {
          inlineMarks: 'inherit',
          softBreaks: 'inherit',
          listTypes: 'inherit',
        },
        links: 'inherit',
      }),
      plainLine2: fields.child({
        kind: 'inline',
        placeholder: 'Plain text line 2...',
        formatting: {
          inlineMarks: 'inherit',
          softBreaks: 'inherit',
        },
        links: 'inherit',
      }),
      hilight: fields.child({
        kind: 'inline',
        placeholder: 'Hilighted text...',
        formatting: {
          inlineMarks: 'inherit',
          softBreaks: 'inherit',
        },
        links: 'inherit',
      }),
    },
    chromeless: true,
  }),
};

export const componentBlockRenderers: InferRenderersForComponentBlocks<
  typeof componentBlocks
> = {
  'hilight-heading': props => {
    return <Heading1 {...props} />;
  },
};
