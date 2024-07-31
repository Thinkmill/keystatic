import { base64UrlDecode, base64UrlEncode } from '#base64';
import { toastQueue } from '@keystar/ui/toast';
import { ComponentSchema } from '../form/api';
import { serializeEntryToFiles } from './updating';
import { parseEntry } from './useItemData';
import { FormatInfo, getEntryDataFilepath } from './utils';
import * as s from 'superstruct';

const keystaticEntryAttributeSchema = s.type({
  slug: s.optional(s.string()),
  files: s.record(
    s.string(),
    s.coerce(s.instance(Uint8Array), s.string(), value =>
      base64UrlDecode(value)
    )
  ),
});

const textDecoder = new TextDecoder();

function parseEntryFromHtml(
  html: string,
  format: FormatInfo,
  schema: Record<string, ComponentSchema>,
  slugField: string | undefined
) {
  const parsedHtml = new DOMParser().parseFromString(html, 'text/html');
  const pre = parsedHtml.querySelector('pre');
  if (!pre?.dataset.keystaticEntry) {
    return;
  }
  try {
    const parsed = JSON.parse(pre.dataset.keystaticEntry);
    const entryInfo = keystaticEntryAttributeSchema.create(parsed);
    const files = new Map<string, Uint8Array>(Object.entries(entryInfo.files));
    return parseEntry(
      {
        dirpath: entryInfo.slug ?? 'entry',
        format,
        schema,
        slug: slugField
          ? { field: slugField, slug: entryInfo.slug ?? '' }
          : undefined,
        requireFrontmatter: true,
      },
      files
    ).initialState;
  } catch {}
}

function parseEntryFromPlaintext(
  bytes: Uint8Array,
  format: FormatInfo,
  schema: Record<string, ComponentSchema>,
  slugInfo: { field: string; slug: string } | undefined
) {
  try {
    const dirpath = slugInfo?.slug ?? 'entry';
    return parseEntry(
      { dirpath, format, schema, slug: slugInfo, requireFrontmatter: true },
      new Map([[getEntryDataFilepath(dirpath, format), bytes]])
    ).initialState;
  } catch {}
}

export async function getPastedEntry(
  format: FormatInfo,
  schema: Record<string, ComponentSchema>,
  slugInfo: { field: string; slug: string } | undefined
) {
  let clipboardItems: ClipboardItem[];
  try {
    // TODO: maybe explore alternative UI for this with an input
    // and instructing users to paste there so the permission is not needed
    clipboardItems = await navigator.clipboard.read();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'NotAllowedError') {
      toastQueue.critical(
        'Failed to paste because clipboard access was denied',
        { timeout: 5000 }
      );
      return;
    }
    toastQueue.critical('Failed to read clipboard', { timeout: 5000 });
    return;
  }
  for (const item of clipboardItems) {
    if (item.types.includes('text/html')) {
      const html = await item.getType('text/html');
      const text = await html.text();
      const entry = parseEntryFromHtml(text, format, schema, slugInfo?.field);
      if (entry) {
        return entry;
      }
    }
    if (item.types.includes('text/plain')) {
      const plain = await item.getType('text/plain');
      const text = await plain.arrayBuffer();
      const entry = parseEntryFromPlaintext(
        new Uint8Array(text),
        format,
        schema,
        slugInfo
      );
      if (entry) {
        return entry;
      }
    }
  }
  toastQueue.critical('Entry not found in clipboard', { timeout: 5000 });
}

function serializeEntryForClipboard(
  state: Record<string, unknown>,
  format: FormatInfo,
  schema: Record<string, ComponentSchema>,
  slug: { field: string; value: string } | undefined
) {
  const basePath = slug?.value ?? 'entry';
  const files = serializeEntryToFiles({
    basePath,
    format,
    schema,
    slug,
    state,
  });
  const element = document.createElement('pre');
  element.dataset.keystaticEntry = JSON.stringify({
    slug: slug?.value,
    files: Object.fromEntries(
      files.map(f => [f.path, base64UrlEncode(f.contents)])
    ),
  });

  const mainEntryFilepath = getEntryDataFilepath(basePath, format);
  const mainFile = files.find(f => f.path === mainEntryFilepath);
  if (!mainFile) {
    throw new Error('No main entry file found');
  }
  const plain = textDecoder.decode(mainFile.contents);
  element.textContent = plain;
  return { html: element.outerHTML, plain };
}

export function copyEntryToClipboard(
  state: Record<string, unknown>,
  format: FormatInfo,
  schema: Record<string, ComponentSchema>,
  slug: { field: string; value: string } | undefined
) {
  const out = serializeEntryForClipboard(state, format, schema, slug);
  navigator.clipboard.write([
    new ClipboardItem({
      'text/plain': new Blob([out.plain], { type: 'text/plain' }),
      'text/html': new Blob([out.html], { type: 'text/html' }),
    }),
  ]);
}
