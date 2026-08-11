import { Pressable } from 'react-aria-components';
import { filterDOMProps } from 'react-aria/filterDOMProps';
import { mergeRefs } from 'react-aria/mergeRefs';
import { forwardRef, useEffect, useRef } from 'react';

import { TextLinkButtonProps } from './types';
import { useTextLink } from './useTextLink';

/** @private Forked variant where an "href" is NOT provided. */
export const TextLinkButton = forwardRef<HTMLSpanElement, TextLinkButtonProps>(
  function TextLink(props, forwardedRef) {
    const {
      children,
      prominence = 'default',
      autoFocus,
      ...otherProps
    } = props;
    const domRef = useRef<HTMLSpanElement>(null);
    const { Wrapper, className } = useTextLink();

    useEffect(() => {
      if (autoFocus) domRef.current?.focus();
    }, [autoFocus]);

    return (
      <Wrapper>
        <Pressable {...otherProps}>
          <span
            {...filterDOMProps(otherProps, { labelable: true })}
            ref={mergeRefs(domRef, forwardedRef)}
            role="button"
            tabIndex={0}
            data-prominence={prominence}
            className={className}
          >
            {children}
          </span>
        </Pressable>
      </Wrapper>
    );
  }
);
