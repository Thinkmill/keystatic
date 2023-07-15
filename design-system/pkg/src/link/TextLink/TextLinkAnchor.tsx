import { useLink } from '@react-aria/link';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { forwardRef } from 'react';

import { useLinkComponent } from '../linkContext';

import { useTextLink } from './useTextLink';
import { TextLinkAnchorProps } from './types';

/** @private Forked variant where an "href" is provided. */
export const TextLinkAnchor = forwardRef<
  HTMLAnchorElement,
  TextLinkAnchorProps
>(function TextLink(props, forwardedRef) {
  const {
    children,
    download,
    href,
    hrefLang,
    ping,
    referrerPolicy,
    rel,
    target,
    ...otherProps
  } = props;

  const LinkComponent = useLinkComponent(forwardedRef);
  const domRef = useObjectRef(forwardedRef);
  const { Wrapper, ...styleProps } = useTextLink(props);
  const { linkProps } = useLink(otherProps, domRef);

  return (
    <Wrapper>
      <LinkComponent
        ref={domRef}
        download={download}
        href={href}
        hrefLang={hrefLang}
        ping={ping}
        referrerPolicy={referrerPolicy}
        rel={rel}
        target={target}
        {...mergeProps(linkProps, styleProps)}
      >
        {children}
      </LinkComponent>
    </Wrapper>
  );
});
