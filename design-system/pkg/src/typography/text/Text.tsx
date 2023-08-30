import { filterDOMProps } from '@react-aria/utils';
import { assert, warning } from 'emery';
import { useMemo } from 'react';

import { useSlotProps } from '@keystar/ui/slots';
import { TextProps } from '@keystar/ui/types';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

import { TextContext, TextContextType, useTextContext } from './context';
import { useTextStyles } from './useTextStyles';
import { Truncate } from '../Truncate';
import { useHeadingContext } from '../heading';
import { useVisuallyHiddenRange } from '../useVisuallyHiddenRange';

const filterOptions = { propNames: new Set(['aria-hidden', 'role']) };

export const Text = forwardRefWithAs<TextProps, 'span'>(
  (props, forwardedRef) => {
    props = useSlotProps(props, 'text');
    const headingContext = useHeadingContext();
    const prevContext = useTextContext();
    validateProps(props, prevContext);

    // warn and bail if consumer tries to do something dodgy
    warning(
      !headingContext,
      'The `Text` component is not supported within `Heading` components.'
    );
    if (headingContext) {
      return <span>{props.children}</span>;
    }

    const {
      children,
      color = prevContext?.color ?? 'neutral',
      elementType: ElementType = 'span',
      size = prevContext?.size ?? 'regular',
      trim = !prevContext,
      truncate,
      visuallyHidden,
      weight = prevContext?.weight ?? 'regular',
      ...otherProps
    } = props;

    const styleProps = useTextStyles({
      color,
      size,
      trim,
      weight,
      ...otherProps,
    });
    const visuallyHiddenProps = useVisuallyHiddenRange(visuallyHidden);

    // element preparation
    const content = truncate ? (
      <Truncate lines={truncate}>{children}</Truncate>
    ) : (
      children
    );
    const element = (
      <ElementType
        ref={forwardedRef}
        {...filterDOMProps(otherProps, filterOptions)}
        {...styleProps}
        {...visuallyHiddenProps}
      >
        {content}
      </ElementType>
    );

    // avoid unnecessary re-renders
    const nextContext = useMemo(
      () => ({ size, color, weight }),
      [size, color, weight]
    );

    // avoid nested providers
    if (prevContext || visuallyHidden) {
      return element;
    }

    return (
      <TextContext.Provider value={nextContext}>{element}</TextContext.Provider>
    );
  }
);

function validateProps(props: TextProps, context?: TextContextType) {
  assert(
    !context || !props.align,
    'The "align" prop is unsupported on nested Text.'
  );
  assert(
    !context || !props.trim,
    'The "trim" prop is unsupported on nested Text.'
  );
}
