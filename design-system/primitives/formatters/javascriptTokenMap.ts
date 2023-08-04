import { setWith } from 'lodash';
import StyleDictionary from 'style-dictionary';
import { filenameFromPath } from '../utilities';

export const javascriptTokenMap: StyleDictionary.Formatter = ({
  dictionary,
  file,
}) => {
  const reference = {};
  const name = filenameFromPath(file.destination);

  dictionary.allTokens.forEach(token => {
    setWith(reference, token.path, `var(--${token.name})`, Object);
  });

  return JSON.stringify(reference, null, 2);
};
