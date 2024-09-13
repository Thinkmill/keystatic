import { Field, FieldProps } from '@keystar/ui/field';
import { FormFieldInputProps } from '../../api';
import { EditorState } from 'prosemirror-state';
import { Editor } from './editor';
import { createEditorState } from './editor/editor-state';
import { EditorSchema, getEditorSchema } from './editor/schema';
import { markdocToProseMirror } from './editor/markdoc/parse';
import { format, parse } from '#markdoc';
import { proseMirrorToMarkdoc } from './editor/markdoc/serialize';
import { useEntryLayoutSplitPaneContext } from '../../../app/entry-form';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import {
  gfmAutolinkLiteralFromMarkdown,
  gfmAutolinkLiteralToMarkdown,
} from 'mdast-util-gfm-autolink-literal';
import {
  gfmStrikethroughFromMarkdown,
  gfmStrikethroughToMarkdown,
} from 'mdast-util-gfm-strikethrough';
import { gfmTableFromMarkdown, gfmTableToMarkdown } from 'mdast-util-gfm-table';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { gfmAutolinkLiteral } from 'micromark-extension-gfm-autolink-literal';
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough';
import { gfmTable } from 'micromark-extension-gfm-table';
import { mdxjs } from 'micromark-extension-mdxjs';
import * as Y from 'yjs';
import { mdxToProseMirror } from './editor/mdx/parse';
import { proseMirrorToMDXRoot } from './editor/mdx/serialize';
import { yXmlFragmentToProsemirror } from 'y-prosemirror';
import { Awareness } from 'y-protocols/awareness';

export { createEditorSchema } from './editor/schema';

export function getDefaultValue(schema: EditorSchema) {
  return createEditorState(schema.nodes.doc.createAndFill()!);
}

export function parseToEditorState(
  content: string,
  schema: EditorSchema,
  files: ReadonlyMap<string, Uint8Array>,
  otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>,
  slug: string | undefined
) {
  const doc = markdocToProseMirror(
    parse(content),
    schema,
    files,
    otherFiles,
    slug
  );
  return createEditorState(doc);
}

export function serializeFromEditorState(
  value: EditorState,
  slug: string | undefined
) {
  const other = new Map<string, Uint8Array>();
  const external = new Map<string, Map<string, Uint8Array>>();
  const markdocNode = proseMirrorToMarkdoc(value.doc, {
    extraFiles: other,
    otherFiles: external,
    schema: getEditorSchema(value.schema),
    slug,
  });
  const markdoc = format(markdocNode);
  return {
    content: format(parse(markdoc)),
    other,
    external,
  };
}

export function parseToEditorStateMDX(
  content: string,
  schema: EditorSchema,
  files: ReadonlyMap<string, Uint8Array>,
  otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>,
  slug: string | undefined
) {
  const root = fromMarkdown(content, {
    extensions: [mdxjs(), gfmAutolinkLiteral(), gfmStrikethrough(), gfmTable()],
    mdastExtensions: [
      mdxFromMarkdown(),
      gfmAutolinkLiteralFromMarkdown(),
      gfmStrikethroughFromMarkdown(),
      gfmTableFromMarkdown(),
    ],
  });
  const doc = mdxToProseMirror(root, schema, files, otherFiles, slug);
  return createEditorState(doc);
}

export function serializeFromEditorStateMDX(
  value: EditorState,
  slug: string | undefined
) {
  const other = new Map<string, Uint8Array>();
  const external = new Map<string, Map<string, Uint8Array>>();
  const mdxNode = proseMirrorToMDXRoot(value.doc, {
    extraFiles: other,
    otherFiles: external,
    schema: getEditorSchema(value.schema),
    slug,
  });
  const mdx = toMarkdown(mdxNode, {
    extensions: [
      gfmAutolinkLiteralToMarkdown(),
      gfmStrikethroughToMarkdown(),
      gfmTableToMarkdown(),
      mdxToMarkdown(),
    ],
    rule: '-',
  });
  return {
    content: mdx,
    other,
    external,
  };
}

export function DocumentFieldInput(
  props: FormFieldInputProps<EditorState> & {
    label: string;
    description: string | undefined;
  }
) {
  let entryLayoutPane = useEntryLayoutSplitPaneContext();

  let fieldProps: FieldProps = {
    label: props.label,
    labelElementType: 'span', // the editor element isn't an input, so we need to use a span for the label
    description: props.description,
  };
  if (entryLayoutPane === 'main') {
    fieldProps = {
      'aria-label': props.label,
      // `aria-description` is still in W3C Editor's Draft for ARIA 1.3.
    };
  }

  return (
    <Field
      height={entryLayoutPane === 'main' ? '100%' : undefined}
      {...fieldProps}
    >
      {inputProps => (
        <Editor {...inputProps} value={props.value} onChange={props.onChange} />
      )}
    </Field>
  );
}

export function createEditorStateFromYJS(
  schema: EditorSchema,
  yXmlFragment: Y.XmlFragment,
  awareness: Awareness
) {
  return createEditorState(
    yXmlFragmentToProsemirror(schema.schema, yXmlFragment),
    undefined,
    undefined,
    yXmlFragment,
    awareness
  );
}

export { prosemirrorToYXmlFragment } from 'y-prosemirror';
