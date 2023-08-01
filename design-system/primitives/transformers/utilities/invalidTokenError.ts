import type { TransformedToken } from 'style-dictionary';

import { namePathToDotNotation } from '../namePathToDotNotation';

const composeValueErrorMessage = (token: TransformedToken) => {
  return `Invalid token "${namePathToDotNotation.transformer(
    token,
    {}
  )}" in file "${token.filePath}". Transformed value: "${JSON.stringify(
    token.value
  )}". ${
    token.original.value
      ? `Original value: "${JSON.stringify(token.original.value)}" `
      : ''
  }This may be due to referencing a token that does not exists.`;
};

const composeValuePropertyErrorMessage = (
  token: TransformedToken,
  property: string
) => {
  return `Invalid property "${property}" of token "${namePathToDotNotation.transformer(
    token,
    {}
  )}" in file "${token.filePath}". Transformed property value: "${
    token.value[property]
  }". ${
    token.original.value
      ? `Original value: "${token.original.value[property]}" `
      : ''
  }This may be due to referencing a token that does not exists.`;
};

export class invalidTokenValueError extends Error {
  constructor(token: TransformedToken) {
    super(composeValueErrorMessage(token));
    Error.captureStackTrace(this, invalidTokenValueError);
  }
}

export class invalidTokenValuePropertyError extends Error {
  constructor(token: TransformedToken, property: string) {
    super(composeValuePropertyErrorMessage(token, property));
    Error.captureStackTrace(this, invalidTokenValuePropertyError);
  }
}
