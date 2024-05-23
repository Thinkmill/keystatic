import { expect, test } from '@jest/globals';
import { parse, format } from '#markdoc';
import path from 'path';
import { createReader } from '../../../../../reader';
import { editorOptionsToConfig } from '../../config';
import { markdocToProseMirror } from '../markdoc/parse';
import { proseMirrorToMarkdoc } from '../markdoc/serialize';
import { createEditorSchema } from '../schema';
import keystaticConfig, {
  components,
} from '../../../../../../../../docs/keystatic.config';
import { fileURLToPath } from 'url';

test('docs serialisation', async () => {
  const docsPath = path.resolve(
    fileURLToPath(import.meta.url),
    '../../../../../../../../../docs'
  );
  const reader = createReader(docsPath, keystaticConfig);

  const result = await reader.collections.pages.all({
    resolveLinkedFiles: true,
  });
  expect(result.length).toBeGreaterThan(0);
  const schema = createEditorSchema(
    editorOptionsToConfig({}),
    components,
    false
  );

  for (const page of result) {
    try {
      for (const node of page.entry.content.node.walk()) {
        if (node.type === 'em' || node.type === 'strong') {
          delete node.attributes.marker;
        }
      }
      const formatted = format(parse(format(page.entry.content.node)));
      const prosemirror = markdocToProseMirror(
        parse(formatted),
        schema,
        new Map(),
        new Map(),
        page.slug
      );
      const markdoc = proseMirrorToMarkdoc(prosemirror, {
        extraFiles: new Map(),
        otherFiles: new Map(),
        schema,
        slug: page.slug,
      });
      expect(format(parse(format(markdoc)))).toBe(formatted);
    } catch (cause) {
      throw new Error(`Error in ${page.slug}`, { cause });
    }
  }
});
