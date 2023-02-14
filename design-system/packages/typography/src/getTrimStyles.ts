import { VoussoirTheme } from '@voussoir/style';

type FontDefinition = VoussoirTheme['fontsize']['text']['medium']; // 'medium' is arbitrary, we just want the shape
/**
 * Using [capsize](https://seek-oss.github.io/capsize/), get the leading-trim
 * styles for a text element.
 */
export function getTrimStyles(fontDefinition: FontDefinition) {
  const { capheightTrim: marginBottom, baselineTrim: marginTop } =
    fontDefinition;

  return {
    display: 'block',
    lineHeight: fontDefinition.lineheight,
    '::before': { content: '" "', display: 'table', marginBottom },
    '::after': { content: '" "', display: 'table', marginTop },
  };
}
