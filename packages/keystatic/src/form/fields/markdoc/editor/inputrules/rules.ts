import escape from 'escape-string-regexp';
import { EditorSchema } from '../schema';
import {
  replaceTypeInputRuleHandler,
  stringHandler,
  textblockTypeInputRuleHandler,
  wrappingInputRuleHandler,
} from './handlers';
import { InputRule } from './inputrules';
import { shortcuts, simpleMarkShortcuts } from './shortcuts';
import { MarkType, Node } from 'prosemirror-model';
import { insertMenuInputRule } from '../autocomplete/insert-menu';
import { attributeMenuInputRule } from '../attributes/new-attribute';

const textShortcutRules = Object.entries(shortcuts).map(
  ([shortcut, replacement]): InputRule => ({
    pattern: new RegExp(`(${escape(shortcut)})\\s$`),
    handler: stringHandler(replacement),
  })
);

export function inputRulesForSchema({ nodes, marks }: EditorSchema) {
  const rules = [...textShortcutRules];
  rules.push({
    pattern: /^\s*>\s$/,
    handler: wrappingInputRuleHandler(nodes.blockquote),
  });

  rules.push({
    pattern: /^\s*\d+(?:\.|\))\s$/,
    handler: wrappingInputRuleHandler(nodes.ordered_list),
  });

  rules.push({
    pattern: /^\s*([-+*])\s$/,
    handler: wrappingInputRuleHandler(nodes.unordered_list),
  });

  rules.push({
    pattern: /^```(\w+)?\s$/,
    handler: textblockTypeInputRuleHandler(nodes.code_block, match => ({
      language: match[1] ?? 'plain',
    })),
  });

  rules.push({
    pattern: /^---$/,
    handler: replaceTypeInputRuleHandler(nodes.divider),
  });

  rules.push({
    pattern: /^(#{1,6})\s$/,
    handler: textblockTypeInputRuleHandler(nodes.heading, match => ({
      level: match[1].length,
    })),
  });

  for (const [markName, shortcuts] of simpleMarkShortcuts) {
    const mark = marks[markName];
    for (const shortcut of shortcuts) {
      rules.push({
        pattern: new RegExp(
          `${
            shortcut[0] === '_'
              ? '(?:^|\\s)'
              : shortcut === '*'
              ? '(?:^|[^\\*])'
              : ''
          }${escape(shortcut)}([^${escape(shortcut[0])}\\s]|(?:[^${escape(
            shortcut[0]
          )}\\s].*[^\\s]))${escape(shortcut)}$`
        ),
        handler: (state, [, content], __start, end) => {
          const start = end - content.length - shortcut.length * 2;
          if (!allowsMarkType(state.doc, start, end, mark)) return null;
          const tr = state.tr;
          tr.addMark(
            start + shortcut.length,
            end - shortcut.length,
            mark.create()
          );
          tr.delete(end - shortcut.length, end);
          tr.delete(start, start + shortcut.length);
          tr.removeStoredMark(mark);
          return tr;
        },
      });
    }
  }
  const linkType = marks.link;
  rules.push({
    pattern: /(?:^|[^!])\[(.*)\]\((.*)\)$/,
    handler(state, [, text, href], __start, end) {
      const start = end - href.length - text.length - 4;
      if (!allowsMarkType(state.doc, start, end, linkType)) return null;
      const tr = state.tr;
      tr.addMark(start, end, linkType.create({ href }));
      tr.delete(start + 1 + text.length, end);
      tr.delete(start, start + 1);
      tr.removeStoredMark(linkType);
      return tr;
    },
  });

  rules.push(insertMenuInputRule);
  rules.push(attributeMenuInputRule);
  return rules;
}

function allowsMarkType(
  doc: Node,
  start: number,
  end: number,
  markType: MarkType
) {
  let allowsMarkType = true;
  doc.nodesBetween(start, end, node => {
    if (!node.isText && !node.type.allowsMarkType(markType)) {
      allowsMarkType = false;
    }
  });
  return allowsMarkType;
}
