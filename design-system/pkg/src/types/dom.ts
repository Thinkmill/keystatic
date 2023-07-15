import { HTMLAttributeAnchorTarget, HTMLAttributeReferrerPolicy } from 'react';

export interface AnchorDOMProps {
  /** Causes the browser to treat the linked URL as a download. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download) */
  download?: boolean | string;
  /** The URL that the hyperlink points to. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href). */
  href: string;
  /** Hints at the human language of the linked URL. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-hreflang). */
  hrefLang?: string;
  /** A space-separated list of URLs. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-ping).  */
  ping?: string;
  /** How much of the referrer to send when following the link. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-referrerpolicy). */
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  /** The relationship of the linked URL as space-separated link types. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-rel) */
  rel?: string;
  /** The browsing context (a tab, window, or <iframe>) in which to open the linked URL. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target). */
  target?: HTMLAttributeAnchorTarget;
}
