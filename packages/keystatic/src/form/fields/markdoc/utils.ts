import { Node, ValidateError } from '@markdoc/markdoc';

export function syntaxOnlyMarkdocValidate(parsed: Node): ValidateError[] {
  const parseErrors: ValidateError[] = [];
  for (const node of parsed.walk()) {
    for (const err of node.errors) {
      parseErrors.push({
        error: err,
        lines: node.lines,
        type: node.type,
        location: node.location,
      });
    }
  }
  return parseErrors;
}
