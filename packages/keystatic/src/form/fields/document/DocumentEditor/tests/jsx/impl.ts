// slate-hyperscript depends on Array.prototype.flat
import { createHyperscript } from 'slate-hyperscript';

import { editorSchema } from '../../editor';

const blockTypes: Record<string, { type: string }> = {};
Object.keys(editorSchema).forEach(key => {
  if (key !== 'editor') {
    blockTypes[key] = { type: key };
  }
});

export const __jsx = createHyperscript({
  elements: {
    ...blockTypes,
    link: { type: 'link' },
  },
  creators: {},
});
