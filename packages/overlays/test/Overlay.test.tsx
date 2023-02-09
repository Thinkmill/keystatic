import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { TestProvider } from '@voussoir/core';
import { createRef } from 'react';

import { Overlay } from '../src';

describe('overlays/Overlay', () => {
  it('should render nothing if isOpen is not set', () => {
    const { queryByTestId } = render(
      <Overlay>
        <ExampleOverlay />
      </Overlay>,
      { wrapper: TestProvider }
    );

    expect(queryByTestId(testID)).toBe(null);
  });

  it('should render children when isOpen is set', () => {
    const { getByTestId } = render(
      <Overlay isOpen>
        <ExampleOverlay />
      </Overlay>,
      { wrapper: TestProvider }
    );

    expect(getByTestId(testID)).toBeTruthy();
  });

  it('should render into a portal in the body', async () => {
    const overlayRef = createRef<HTMLDivElement>();
    render(
      <Overlay isOpen ref={overlayRef}>
        <ExampleOverlay />
      </Overlay>
    );

    const overlayNode = overlayRef.current;
    expect(overlayNode?.parentNode).toBe(document.body);
  });
});

const testID = 'overlay-content';

function ExampleOverlay() {
  return <span data-testid={testID}>Overlay content</span>;
}
