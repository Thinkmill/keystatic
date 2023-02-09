import { warning } from 'emery';
import {
  injectGlobal,
  resetClassName,
  tokenSchema,
  VoussoirTheme,
} from '@voussoir/style';

import { cssCustomProperties } from './cssCustomProperties';

type StrictBackground = keyof VoussoirTheme['color']['background'];

// TODO: need an SSR-friendly variant, something like:
// https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/color-mode/src/color-mode-script.tsx
export function injectVoussoirStyles(background?: StrictBackground) {
  warning(
    !globalsInjected,
    'Voussoir global styles already injected. Try calling `injectVoussoirStyles()` closer to the React root.'
  );
  injectGlobal(cssCustomProperties);
  injectGlobal(documentReset(background));
  injectGlobal(elementReset);

  markGlobalsImported();
}

/**
 * Deactivate auto-enlargement of small text in Safari. Remove the default touch
 * highlight in Safari. Reset the body element to sane defaults.
 */
const documentReset = (background: StrictBackground = 'canvas') =>
  flatString(`
  html {
    scroll-behavior: smooth;
    text-size-adjust: none;
    -webkit-tap-highlight-color: #0000;
  }
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }

  body {
    background-color: ${tokenSchema.color.background[background]};
    margin: 0;
  }
`);

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

// Tracker
// ----------------------------------------------------------------------------

let globalsInjected = false;

/** @private exported for testing */
export function markGlobalsImported() {
  globalsInjected = true;
}

/** @private */
export function ensureGlobalsImported() {
  warning(
    globalsInjected,
    'Voussoir components used before global styles injected.'
  );
}
