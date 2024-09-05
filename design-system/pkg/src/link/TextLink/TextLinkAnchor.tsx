import { useLink } from '@react-aria/link';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { forwardRef } from 'react';

import { useTextLink } from './useTextLink';
import { TextLinkAnchorProps } from './types';

/** @private Forked variant where an "href" is provided. */
export const TextLinkAnchor = forwardRef<
  HTMLAnchorElement,
  TextLinkAnchorProps
>(function TextLink(props, forwardedRef) {
  const { children } = props;

  const domRef = useObjectRef(forwardedRef);
  const { Wrapper, ...styleProps } = useTextLink(props);
  const { linkProps } = useLink(props, domRef);

  return (
    <Wrapper>
      <a ref={domRef} {...mergeProps(linkProps, styleProps)}>
        {children}
      </a>
    </Wrapper>
  );
});
