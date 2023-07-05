import { ForwardedRef, forwardRef } from 'react';

import { TextLinkAnchor } from './TextLinkAnchor';
import { TextLinkButton } from './TextLinkButton';
import { TextLinkProps } from './types';

/**
 * Text links take users to another place in the application, and usually appear
 * within or directly following a sentence. Styled to resemble a hyperlink.
 */
export const TextLink = forwardRef<
  HTMLAnchorElement | HTMLSpanElement,
  TextLinkProps
>(function TextLink(props, forwardedRef) {
  if ('href' in props) {
    return (
      <TextLinkAnchor
        {...props}
        ref={forwardedRef as ForwardedRef<HTMLAnchorElement>}
      />
    );
  }

  return (
    <TextLinkButton
      {...props}
      ref={forwardedRef as ForwardedRef<HTMLSpanElement>}
    />
  );
});
