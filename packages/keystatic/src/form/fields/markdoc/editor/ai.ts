import { events } from 'fetch-event-stream';
import * as s from 'superstruct';
import { Config } from '../../../..';
import { getCloudAuth } from '../../../../app/auth';
import {
  KEYSTATIC_CLOUD_API_URL,
  KEYSTATIC_CLOUD_HEADERS,
} from '../../../../app/utils';
import { clipboardTextParser } from './markdoc/clipboard';
import { proseMirrorToMarkdoc } from './markdoc/serialize';
import { EditorView } from 'prosemirror-view';
import { getEditorSchema } from './schema';
import { format } from '#markdoc';

const aiResponseSchema = s.type({
  response: s.string(),
});

export async function handleAI(
  config: Config,
  view: EditorView,
  action: string
) {
  const auth = getCloudAuth(config);
  if (!auth) return;
  const from = 0;
  const { state } = view;
  const to = state.selection.to;
  const slice = state.doc.slice(from, to);
  let content: string;
  try {
    content = format(
      proseMirrorToMarkdoc(state.doc.type.create({}, slice.content), {
        otherFiles: new Map(),
        extraFiles: new Map(),
        schema: getEditorSchema(view.state.schema),
        slug: undefined,
      })
    );
  } catch (err) {
    console.log('failed to serialize text as markdoc', err);
    content = slice.content.textBetween(0, slice.content.size, '\n\n');
  }
  const res = await fetch(`${KEYSTATIC_CLOUD_API_URL}/v1/ai/text`, {
    method: 'POST',
    body: JSON.stringify({
      action,
      content,
    }),
    headers: {
      ...KEYSTATIC_CLOUD_HEADERS,
      Accept: 'text/event-stream',
      Authorization: `Bearer ${auth.accessToken}`,
    },
  });
  if (!res.ok) {
    return;
  }

  let full = '';
  let start = state.selection.to;
  let end = state.selection.to;
  let lastTr;

  for await (const event of events(res)) {
    if (event.data === '[DONE]') continue;
    let text: string;
    try {
      text = aiResponseSchema.create(JSON.parse(event.data!)).response;
    } catch {
      const { tr } = view.state;
      tr.deleteRange(start, end);
      view.dispatch(tr);
      break;
    }
    full += text;
    const slice = clipboardTextParser(
      full,
      view.state.doc.resolve(start),
      false,
      view
    );
    if (lastTr) {
      let inverted = view.state.tr;
      for (let i = lastTr.steps.length - 1; i >= 0; i--) {
        inverted.step(lastTr.steps[i].invert(lastTr.docs[i]));
      }
      view.dispatch(inverted);
    }

    const { tr } = view.state;
    tr.replaceRange(state.selection.from, state.selection.to, slice);
    lastTr = tr;
    view.dispatch(tr);
  }
}
