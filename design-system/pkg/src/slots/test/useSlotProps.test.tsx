import { expect, it, describe, afterEach, jest } from '@jest/globals';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SlotProvider, useSlotProps } from '..';
import { useLayoutEffect } from 'react';

describe('slots', function () {
  let results = {};

  afterEach(() => {
    results = {};
  });

  function Component(props: any) {
    const _results = useSlotProps(props, 'slotname');
    useLayoutEffect(() => {
      results = _results;
    });
    return (
      <button id={_results.id} onClick={_results.onClick}>
        click me
      </button>
    );
  }

  it('sets props', function () {
    let slots = {
      slotname: { UNSAFE_className: 'foo', isFoo: true, isBar: true },
    };
    render(
      <SlotProvider slots={slots}>
        <Component />
      </SlotProvider>
    );
    expect(results).toMatchObject({
      UNSAFE_className: 'foo',
      isFoo: true,
      isBar: true,
    });
  });

  it('overrides local props', function () {
    let slots = {
      slotname: {
        UNSAFE_className: 'foo',
        isFoo: false,
        isBar: false,
        label: null,
      },
    };
    render(
      <SlotProvider slots={slots}>
        <Component UNSAFE_className="bar" isFoo isBar label="baz" />
      </SlotProvider>
    );
    expect(results).toMatchObject({
      UNSAFE_className: expect.stringMatching(/(foo bar|bar foo)/),
      isFoo: false,
      isBar: false,
      label: null,
    });
  });

  it('undefined does not override local props', function () {
    let slots = {
      slotname: { label: undefined },
    };
    render(
      <SlotProvider slots={slots}>
        <Component label="baz" />
      </SlotProvider>
    );
    expect(results).toMatchObject({
      label: 'baz',
    });
  });

  it('chains functions', async function () {
    let onClick = jest.fn();
    let onClickUser = jest.fn();
    let slots = {
      slotname: { onClick },
    };
    let { getByRole } = render(
      <SlotProvider slots={slots}>
        <Component label="baz" onClick={onClickUser} />
      </SlotProvider>
    );

    await userEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClickUser).toHaveBeenCalledTimes(1);
  });

  it('lets users set their own id', function () {
    let slots = {
      slotname: { id: 'foo' },
    };
    render(
      <SlotProvider slots={slots}>
        <Component label="baz" id="bar" />
      </SlotProvider>
    );
    expect(results).toMatchObject({ id: 'bar' });
  });
});
