import { useButton } from '@react-aria/button';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { forwardRef } from 'react';

import { TextLinkButtonProps } from './types';
import { useTextLink } from './useTextLink';

/** @private Forked variant where an "href" is NOT provided. */
export const TextLinkButton = forwardRef<HTMLSpanElement, TextLinkButtonProps>(
  function TextLink(props, forwardedRef) {
    const { children, ...otherProps } = props;

    const domRef = useObjectRef(forwardedRef);
    const { Wrapper, ...styleProps } = useTextLink(otherProps);
    const { buttonProps } = useButton(
      { elementType: 'span', ...otherProps },
      domRef
    );

    return (
      <Wrapper>
        <span ref={domRef} {...mergeProps(buttonProps, styleProps)}>
          {children}
        </span>
      </Wrapper>
    );
  }
);
