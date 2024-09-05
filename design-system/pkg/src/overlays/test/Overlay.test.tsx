import { expect, describe, it } from '@jest/globals';
import { createRef, ForwardedRef, forwardRef, useRef } from 'react';

import { renderWithProvider } from '#test-utils';

import { Overlay, OverlayProps } from '..';

describe('overlays/Overlay', () => {
  it('should render nothing if isOpen is not set', () => {
    const { queryByTestId } = renderWithProvider(<ExampleOverlay />);

    expect(queryByTestId(testID)).toBe(null);
  });

  it('should render children when isOpen is set', () => {
    const { getByTestId } = renderWithProvider(<ExampleOverlay isOpen />);

    expect(getByTestId(testID)).toBeTruthy();
  });

  it('should render into a portal in the body', async () => {
    const overlayRef = createRef<HTMLDivElement>();
    renderWithProvider(<ExampleOverlay isOpen ref={overlayRef} />);

    const overlayNode = overlayRef.current;
    expect(overlayNode?.parentNode).toBe(document.body);
  });
});

const testID = 'overlay-content';

const ExampleOverlay = forwardRef(function ExampleOverlay(
  props: Partial<OverlayProps>,
  ref: ForwardedRef<HTMLDivElement>
) {
  let nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Overlay {...props} ref={ref} nodeRef={nodeRef}>
      <span data-testid={testID} ref={nodeRef}>
        Overlay content
      </span>
    </Overlay>
  );
});
