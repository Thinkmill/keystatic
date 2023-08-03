import { setWith } from 'lodash';
import StyleDictionary from 'style-dictionary';

const { fileHeader } = StyleDictionary.formatHelpers;

export const javascriptTokenMap: StyleDictionary.Formatter = ({
  dictionary,
  file,
}) => {
  const reference = {};

  dictionary.allTokens.forEach(token => {
    setWith(reference, token.path, `var(--${token.name})`, Object);
  });

  return (
    fileHeader({ file }) +
    `export const tokenSchema = ${JSON.stringify(reference, null, 2)};`
  );
};
