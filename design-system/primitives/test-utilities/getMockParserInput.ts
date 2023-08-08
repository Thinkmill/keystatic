export const parserOutput = {
  color: {
    value: 'red',
    comment: 'a red color',
    $type: 'color',
    $extensions: {},
    alpha: 0.5,
  },
};

const parserInput: { [Property in jsonFormats]: string } = {
  'json.w3c': `{
    "color": {
      "$value": 'red',
      "$description": "a red color",
      "$type": "color",
      "$extensions": {},
      "alpha": 0.5
    }
  }`,
  'json.default': `{
    "color": {
      "value": 'red',
      "description": "a red color",
      "type": "color",
      "extensions": {},
      "alpha": 0.5
    }
  }`,
  'json5.w3c': `{
    "color": {
      // comment
      $value: 'red',
      "$description": "a red color",
      '$type': "color",
      "$extensions": {},
      alpha: 0.5,
    }
  }`,
  'json5.default': `{
    "color": {
      // comment
      value: 'red',
      "description": "a red color",
      'type': "color",
      "extensions": {},
      alpha: 0.5,
    }
  }`,
};

type jsonFormats = 'json5.default' | 'json5.w3c' | 'json.default' | 'json.w3c';

/**
 *
 * @param contents jsonFormats or string taht replaces content in return
 * @returns predefined json string or override
 */
export const getMockParserInput = (
  contents: jsonFormats | string,
  filePath?: string
): { filePath: string; contents: string } => {
  // use predefined if no override
  if (
    ['json5.default', 'json5.w3c', 'json.default', 'json.w3c'].includes(
      contents
    )
  ) {
    contents = parserInput[contents as jsonFormats];
  }

  return {
    filePath: filePath || `path/to/file/token.json`,
    contents,
  };
};
