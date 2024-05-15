import { Descendant, Editor, Transforms, Range, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { isValidURL } from '../isValidURL';
import { insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading } from '../ui-utils';
import { deserializeHTML } from './html';
import { deserializeMarkdown } from './markdown';
import { base64UrlEncode, base64UrlDecode } from '#base64';
import { isBlock } from '../editor';

const urlPattern = /https?:\/\//;

function insertFragmentButDifferent(editor: Editor, nodes: Descendant[]) {
  if (isBlock(nodes[0])) {
    insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, nodes);
  } else {
    Transforms.insertFragment(editor, nodes);
  }
}

const clipboardFormatKey = 'x-keystatic-fragment';

export const getDefaultView = (value: any): globalThis.Window | null => {
  return (
    (value && value.ownerDocument && value.ownerDocument.defaultView) || null
  );
};

const isDOMNode = (value: any): value is globalThis.Node => {
  const window = getDefaultView(value);
  return !!window && value instanceof window.Node;
};

const isDOMText = (value: any): value is globalThis.Text => {
  return isDOMNode(value) && value.nodeType === 3;
};

const isDOMElement = (value: any): value is globalThis.Element => {
  return isDOMNode(value) && value.nodeType === 1;
};

const getPlainText = (domNode: globalThis.Node) => {
  let text = '';

  if (isDOMText(domNode) && domNode.nodeValue) {
    return domNode.nodeValue;
  }

  if (isDOMElement(domNode)) {
    for (const childNode of Array.from(domNode.childNodes)) {
      text += getPlainText(childNode);
    }

    const display = getComputedStyle(domNode).getPropertyValue('display');

    if (display === 'block' || display === 'list' || domNode.tagName === 'BR') {
      text += '\n';
    }
  }

  return text;
};

function setFragmentData(e: Editor, data: DataTransfer) {
  const { selection } = e;

  if (!selection) {
    return;
  }

  const [start, end] = Range.edges(selection);
  const startVoid = Editor.void(e, { at: start.path });
  const endVoid = Editor.void(e, { at: end.path });

  if (Range.isCollapsed(selection) && !startVoid) {
    return;
  }

  // Create a fake selection so that we can add a Base64-encoded copy of the
  // fragment to the HTML, to decode on future pastes.
  const domRange = ReactEditor.toDOMRange(e, selection);
  let contents = domRange.cloneContents();
  let attach = contents.childNodes[0] as HTMLElement;

  // Make sure attach is non-empty, since empty nodes will not get copied.
  contents.childNodes.forEach(node => {
    if (node.textContent && node.textContent.trim() !== '') {
      attach = node as HTMLElement;
    }
  });

  // COMPAT: If the end node is a void node, we need to move the end of the
  // range from the void node's spacer span, to the end of the void node's
  // content, since the spacer is before void's content in the DOM.
  if (endVoid) {
    const [voidNode] = endVoid;
    const r = domRange.cloneRange();
    const domNode = ReactEditor.toDOMNode(e, voidNode);
    r.setEndAfter(domNode);
    contents = r.cloneContents();
  }

  // COMPAT: If the start node is a void node, we need to attach the encoded
  // fragment to the void node's content node instead of the spacer, because
  // attaching it to empty `<div>/<span>` nodes will end up having it erased by
  // most browsers. (2018/04/27)
  if (startVoid) {
    attach = contents.querySelector('[data-slate-spacer]')! as HTMLElement;
  }

  // Remove any zero-width space spans from the cloned DOM so that they don't
  // show up elsewhere when pasted.
  Array.from(contents.querySelectorAll('[data-slate-zero-width]')).forEach(
    zw => {
      const isNewline = zw.getAttribute('data-slate-zero-width') === 'n';
      zw.textContent = isNewline ? '\n' : '';
    }
  );

  // Set a `data-slate-fragment` attribute on a non-empty node, so it shows up
  // in the HTML, and can be used for intra-Slate pasting. If it's a text
  // node, wrap it in a `<span>` so we have something to set an attribute on.
  if (isDOMText(attach)) {
    const span = attach.ownerDocument.createElement('span');
    // COMPAT: In Chrome and Safari, if we don't add the `white-space` style
    // then leading and trailing spaces will be ignored. (2017/09/21)
    span.style.whiteSpace = 'pre';
    span.appendChild(attach);
    contents.appendChild(span);
    attach = span;
  }

  const fragment = e.getFragment();
  const string = JSON.stringify(fragment, (key, val) => {
    if (val instanceof Uint8Array) {
      return {
        [bytesName]: base64UrlEncode(val),
      };
    }
    return val;
  });
  const encoded = window.btoa(encodeURIComponent(string));
  attach.setAttribute('data-keystatic-fragment', encoded);
  data.setData(`application/${clipboardFormatKey}`, encoded);

  // Add the content to a <div> so that we can get its inner HTML.
  const div = contents.ownerDocument.createElement('div');
  div.appendChild(contents);
  div.setAttribute('hidden', 'true');
  contents.ownerDocument.body.appendChild(div);
  data.setData('text/html', div.innerHTML);
  data.setData('text/plain', getPlainText(div));
  contents.ownerDocument.body.removeChild(div);
}

const catchSlateFragment = /data-keystatic-fragment="(.+?)"/m;
const getSlateFragmentAttribute = (
  dataTransfer: DataTransfer
): string | void => {
  const htmlData = dataTransfer.getData('text/html');
  const [, fragment] = htmlData.match(catchSlateFragment) || [];
  return fragment;
};

const bytesName = '$$keystaticUint8Array$$';

export function withPasting(editor: Editor): Editor {
  const { insertTextData } = editor;

  editor.setFragmentData = data => {
    setFragmentData(editor, data);
  };
  editor.insertFragmentData = (data: DataTransfer): boolean => {
    /**
     * Checking copied fragment from application/x-slate-fragment or data-slate-fragment
     */
    const fragment =
      data.getData(`application/${clipboardFormatKey}`) ||
      getSlateFragmentAttribute(data);

    if (fragment) {
      const decoded = decodeURIComponent(window.atob(fragment));
      const parsed = JSON.parse(decoded, (key, val: unknown) =>
        typeof val === 'object' &&
        val !== null &&
        bytesName in val &&
        typeof val[bytesName] === 'string'
          ? base64UrlDecode(val[bytesName])
          : val
      ) as Node[];
      editor.insertFragment(parsed);
      return true;
    }
    return false;
  };
  editor.insertTextData = data => {
    const blockAbove = Editor.above(editor, {
      match: isBlock,
    });
    if (blockAbove?.[0].type === 'code') {
      const plain = data.getData('text/plain');
      editor.insertText(plain);
      return true;
    }
    let vsCodeEditorData = data.getData('vscode-editor-data');
    if (vsCodeEditorData) {
      try {
        const vsCodeData = JSON.parse(vsCodeEditorData);
        if (vsCodeData?.mode === 'markdown' || vsCodeData?.mode === 'mdx') {
          const plain = data.getData('text/plain');
          if (plain) {
            const fragment = deserializeMarkdown(plain);
            insertFragmentButDifferent(editor, fragment);
            return true;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    const plain = data.getData('text/plain');

    if (
      // isValidURL is a bit more permissive than a user might expect
      // so for pasting, we'll constrain it to starting with https:// or http://
      urlPattern.test(plain) &&
      isValidURL(plain) &&
      editor.selection &&
      !Range.isCollapsed(editor.selection) &&
      // we only want to turn the selected text into a link if the selection is within the same block
      Editor.above(editor, {
        match: node => isBlock(node) && !isBlock(node.children[0]),
      }) &&
      // and there is only text(potentially with marks) in the selection
      // no other links
      Editor.nodes(editor, {
        match: node => node.type === 'link',
      }).next().done
    ) {
      Transforms.wrapNodes(
        editor,
        { type: 'link', href: plain, children: [] },
        { split: true }
      );
      return true;
    }

    const html = data.getData('text/html');
    if (html) {
      const fragment = deserializeHTML(html);
      insertFragmentButDifferent(editor, fragment);
      return true;
    }

    if (plain) {
      const fragment = deserializeMarkdown(plain);
      insertFragmentButDifferent(editor, fragment);
      return true;
    }

    return insertTextData(data);
  };

  return editor;
}
