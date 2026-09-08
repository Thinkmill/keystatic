import { useButton } from 'react-aria/useButton';
import { mergeProps } from 'react-aria/mergeProps';
import { useObjectRef } from 'react-aria/useObjectRef';
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
