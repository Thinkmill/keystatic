import {
  ClipboardEventHandler,
  CompositionEventHandler,
  FormEventHandler,
  HTMLAttributeAnchorTarget,
  HTMLAttributeReferrerPolicy,
  ReactEventHandler,
} from 'react';

export interface AriaLabellingProps {
  /**
   * Defines a string value that labels the current element.
   */
  'aria-label'?: string;

  /**
   * Identifies the element (or elements) that labels the current element.
   */
  'aria-labelledby'?: string;

  /**
   * Identifies the element (or elements) that describes the object.
   */
  'aria-describedby'?: string;

  /**
   * Identifies the element (or elements) that provide a detailed, extended description for the object.
   */
  'aria-details'?: string;
}

export interface AriaValidationProps {
  // https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage
  /**
   * Identifies the element that provides an error message for the object.
   */
  'aria-errormessage'?: string;
}

// A set of common DOM props that are allowed on any component
// Ensure this is synced with `defaultPropNames` in the `filterDOMProps` util
export interface DOMProps {
  /**
   * The element's unique identifier. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).
   */
  id?: string;
}

export interface AnchorDOMProps {
  /** Causes the browser to treat the linked URL as a download. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download) */
  download?: any;
  /** The URL that the hyperlink points to. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href). */
  href?: string;
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
  /** Hints at the MIME type of the linked URL. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-type). */
  type?: string;
}

export interface TextInputDOMEvents {
  // Clipboard events
  /**
   * Handler that is called when the user copies text. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/oncopy).
   */
  onCopy?: ClipboardEventHandler<HTMLInputElement>;

  /**
   * Handler that is called when the user cuts text. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/oncut).
   */
  onCut?: ClipboardEventHandler<HTMLInputElement>;

  /**
   * Handler that is called when the user pastes text. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/onpaste).
   */
  onPaste?: ClipboardEventHandler<HTMLInputElement>;

  // Composition events
  /**
   * Handler that is called when a text composition system starts a new text composition session. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event).
   */
  onCompositionStart?: CompositionEventHandler<HTMLInputElement>;

  /**
   * Handler that is called when a text composition system completes or cancels the current text composition session. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event).
   */
  onCompositionEnd?: CompositionEventHandler<HTMLInputElement>;

  /**
   * Handler that is called when a new character is received in the current text composition session. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event).
   */
  onCompositionUpdate?: CompositionEventHandler<HTMLInputElement>;

  // Selection events
  /**
   * Handler that is called when text in the input is selected. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/select_event).
   */
  onSelect?: ReactEventHandler<HTMLInputElement>;

  // Input events
  /**
   * Handler that is called when the input value is about to be modified. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event).
   */
  onBeforeInput?: FormEventHandler<HTMLInputElement>;
  /**
   * Handler that is called when the input value is modified. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event).
   */
  onInput?: FormEventHandler<HTMLInputElement>;
}

// DOM props that apply to all text inputs
// Ensure this is synced with useTextField
export interface TextInputDOMProps extends DOMProps, TextInputDOMEvents {
  /**
   * Describes the type of autocomplete functionality the input should provide
   * if any. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete).
   */
  autoComplete?: string;
  /**
   * The maximum number of characters supported by the input. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength).
   */
  maxLength?: number;
  /**
   * The minimum number of characters required by the input. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength).
   */
  minLength?: number;
  /**
   * The name of the input element, used when submitting an HTML form. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name).
   */
  name?: string;
  /**
   * Regex pattern that the value of the input must match to be valid. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern).
   */
  pattern?: string;
  /**
   * Content that appears in the input when it is empty. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder).
   */
  placeholder?: string;
  /**
   * The type of input to render. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type).
   *
   * @default 'text'
   */
  type?:
    | 'email'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'url'
    | (string & {});
  /**
   * Hints at the type of data that might be entered by the user while editing
   * the element or its contents. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode).
   *
   * @default 'text'
   */
  inputMode?:
    | 'decimal'
    | 'email'
    | 'none'
    | 'numeric'
    | 'search'
    | 'tel'
    | 'text'
    | 'url';
}
