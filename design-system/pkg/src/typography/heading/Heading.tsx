import { useMemo } from 'react';

import { useSlotProps } from '@keystar/ui/slots';
import { HeadingProps } from '@keystar/ui/types';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

import { HeadingContext } from './context';
import { useHeadingStyles } from './useHeadingStyles';
import { Truncate } from '../Truncate';
import { useVisuallyHiddenRange } from '../useVisuallyHiddenRange';
import { filterDOMProps } from '@react-aria/utils';

const sizeToElement = { small: 'h4', regular: 'h3', medium: 'h2', large: 'h1' };
const filterOptions = { propNames: new Set(['aria-hidden']) };

/** A typographic device used to communicate levels of hierarchy between text. */
export const Heading = forwardRefWithAs<HeadingProps, 'h3'>((props, ref) => {
  props = useSlotProps(props, 'heading');
  const {
    children,
    size = 'regular',
    truncate,
    elementType: ElementType = sizeToElement[size],
    ...otherProps
  } = props;
  const styleProps = useHeadingStyles({ size, ...props });
  const headingContext = useMemo(() => ({ size }), [size]);
  const visuallyHiddenProps = useVisuallyHiddenRange(props.visuallyHidden);

  // element preparation
  const content = truncate ? (
    <Truncate lines={truncate}>{children}</Truncate>
  ) : (
    children
  );

  return (
    <HeadingContext.Provider value={headingContext}>
      <ElementType
        ref={ref}
        {...filterDOMProps(otherProps, filterOptions)}
        {...styleProps}
        {...visuallyHiddenProps}
      >
        {content}
      </ElementType>
    </HeadingContext.Provider>
  );
});
