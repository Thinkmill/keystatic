import {
  css,
  injectGlobal,
  resetClassName,
  tokenSchema,
  VoussoirTheme,
} from '@keystar/ui/style';

import { cssCustomProperties } from './cssCustomProperties';
import { ColorScheme, ScaleScheme } from '@keystar/ui/types';

type StrictBackground = keyof VoussoirTheme['color']['background'];

export const documentElementClasses = (args: {
  bodyBackground?: StrictBackground;
  colorScheme?: ColorScheme;
  scale?: ScaleScheme;
}) => {
  return `${documentReset(args.bodyBackground)} ksv-theme ksv-scheme--${
    args.colorScheme
  } ksv-scale--${args.scale}`;
};

/**
 * Deactivate auto-enlargement of small text in Safari. Remove the default touch
 * highlight in Safari. Reset the body element to sane defaults.
 */
const documentReset = (background: StrictBackground = 'canvas') =>
  css`
    html& {
      scroll-behavior: smooth;
      text-size-adjust: none;
      -webkit-tap-highlight-color: #0000;
    }
    @media (prefers-reduced-motion: reduce) {
      html& {
        scroll-behavior: auto;
      }
    }

    html& body {
      background-color: ${tokenSchema.color.background[background]};
      margin: 0;
    }
  `;

function flatString(str: string) {
  return str.replace(/\n|\s{2,}/g, '');
}

// Element resets
// ------------------------------

const reset = resetClassName.replace(':', '\\:');
const elementReset = flatString(`
  :where(.${reset}) {
    border: 0;
    box-sizing: border-box;
    font: inherit;
    font-size: 100%;
    margin: 0;
    padding: 0;
    vertical-align: baseline;
  }
  :where(ol.${reset}, ul.${reset}) { list-style: none; }
  :where(canvas.${reset}, img.${reset}, picture.${reset}, svg.${reset}, video.${reset}) { display: block; }
  :where(input.${reset}, button.${reset}, textarea.${reset}, select.${reset}) { appearance: none; background-color: transparent; }
  :where(a.${reset}, abbr.${reset}) { color: inherit; text-decoration: none; }
  :where(table.${reset}) = { border-collapse: collapse; border-spacing: 0; }
`);

injectGlobal(cssCustomProperties);

injectGlobal(elementReset);
