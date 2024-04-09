import Markdoc, { Node, Tag, ValidateError } from '@markdoc/markdoc';
import { isNonEmptyArray } from 'emery/guards';
import { assert } from 'emery/assertions';
import { markdocConfig } from '../markdoc';

class MarkdocFailure extends Error {
  constructor(
    errors: [ValidateError, ...ValidateError[]],
    errorReportingFilepath: string
  ) {
    super();
    this.name = 'MarkdocValidationFailure';
    this.message =
      `Errors in ${errorReportingFilepath}:\n` +
      errors
        .map(error => {
          const location = error.error.location || error.location;
          return `${errorReportingFilepath}:${
            // the +1 is because location.start.line is 0-based
            // but tools generally use 1-based line numbers
            location?.start.line ? location.start.line + 1 : '(unknown line)'
          }${
            location?.start.character ? `:${location.start.character}` : ''
          }: ${error.error.message}`;
        })
        .join('\n');
  }
}

export function transformMarkdoc(
  errorReportingFilepath: string,
  node: Node
): Tag {
  const errors = Markdoc.validate(node, markdocConfig);
  if (isNonEmptyArray(errors)) {
    throw new MarkdocFailure(errors, errorReportingFilepath);
  }
  const renderableNode = Markdoc.transform(node, markdocConfig);

  assert(renderableNode !== null && typeof renderableNode !== 'string');

  // Next is annoying about not plain objects
  return JSON.parse(JSON.stringify(renderableNode));
}
