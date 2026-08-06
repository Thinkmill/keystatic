import { Link as AriaLink } from 'react-aria-components/Link';
import { forwardRef } from 'react';

import { useTextLink } from './useTextLink';
import { TextLinkAnchorProps } from './types';

/** @private Forked variant where an "href" is provided. */
export const TextLinkAnchor = forwardRef<
  HTMLAnchorElement,
  TextLinkAnchorProps
>(function TextLink(props, forwardedRef) {
  const { children, prominence = 'default', ...otherProps } = props;
  const { Wrapper, className } = useTextLink();

  return (
    <Wrapper>
      <AriaLink
        {...otherProps}
        ref={forwardedRef}
        data-prominence={prominence}
        className={className}
      >
        {children}
      </AriaLink>
    </Wrapper>
  );
});
