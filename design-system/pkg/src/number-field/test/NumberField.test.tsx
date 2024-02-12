import React from 'react';
import { expect, it, describe, afterEach, jest } from '@jest/globals';
import { firePress, renderWithProvider } from '#test-utils';
import userEvent from '@testing-library/user-event';

import { NumberField, NumberFieldProps } from '..';

let testId = 'test-id';

function renderNumberField(
  props: Partial<NumberFieldProps> = {},
  ref?: React.RefObject<HTMLInputElement>
) {
  let user = userEvent.setup();
  let result = renderWithProvider(
    <NumberField
      data-testid={testId}
      label="Field label"
      ref={ref}
      {...props}
    />
  );

  let input = result.getByRole('textbox');
  let buttons = result.queryAllByRole('button');
  let group = result.getByRole('group');
  let textField = result.queryByRole('textbox');
  let incrementButton = buttons[0];
  let decrementButton = buttons[1];
  return {
    ...result,
    textField,
    user,
    input,
    group,
    incrementButton,
    decrementButton,
  };
}

describe('number-field/NumberField', () => {
  let onChangeSpy = jest.fn();
  let onBlurSpy = jest.fn();
  let onFocusSpy = jest.fn();
  let onKeyDownSpy = jest.fn();
  let onKeyUpSpy = jest.fn();

  afterEach(() => {
    onChangeSpy.mockClear();
    onBlurSpy.mockClear();
    onFocusSpy.mockClear();
    onKeyDownSpy.mockClear();
    onKeyUpSpy.mockClear();
  });

  it('has correct aria and props', () => {
    let { group, textField, incrementButton, decrementButton } =
      renderNumberField();

    expect(group).toBeDefined();
    expect(textField).toBeTruthy();
    expect(textField).toHaveAttribute('type', 'text');
    expect(textField).toHaveAttribute('inputMode', 'numeric');
    expect(incrementButton).toBeTruthy();
    expect(decrementButton).toBeTruthy();
    expect(incrementButton).toHaveAttribute('tabIndex', '-1');
    expect(decrementButton).toHaveAttribute('tabIndex', '-1');
  });

  it('handles input change', async () => {
    let { input, user } = renderNumberField({ onChange: onChangeSpy });

    await user.type(input, '5');
    await user.tab();

    expect(onChangeSpy).toHaveBeenCalledWith(5);
  });

  it('handles input starting with minus sign', async () => {
    let { input, user } = renderNumberField({ onChange: onChangeSpy });

    await user.type(input, '-');
    await user.tab();
    expect(onChangeSpy).not.toHaveBeenCalled();

    await user.type(input, '-5');
    await user.tab();
    expect(onChangeSpy).toHaveBeenCalledWith(-5);
  });

  it('handles input starting with decimal point', async () => {
    let { input, user } = renderNumberField({ onChange: onChangeSpy });

    await user.type(input, '.5');
    await user.tab();

    expect(onChangeSpy).toHaveBeenCalledWith(0.5);
  });

  it('will not allow typing of a number less than the min', async () => {
    let { input, user } = renderNumberField({
      onChange: onChangeSpy,
      minValue: 10,
    });

    await user.type(input, '2');
    expect(onChangeSpy).not.toHaveBeenCalled();

    await user.tab();
    expect(onChangeSpy).toHaveBeenCalledWith(10);
    expect(input).toHaveValue('10');
  });

  it('will allow typing of a number between min and max', async () => {
    let { input, user } = renderNumberField({
      onChange: onChangeSpy,
      minValue: 20,
      maxValue: 50,
    });

    await user.type(input, '32');
    expect(input).toHaveValue('32');
    expect(onChangeSpy).not.toHaveBeenCalled();

    await user.tab();
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(32);
    expect(input).toHaveValue('32');
  });

  it('will not allow typing of a number greater than the max', async () => {
    let { input, user } = renderNumberField({
      onChange: onChangeSpy,
      maxValue: 1,
      defaultValue: 0,
    });

    await user.type(input, '2');
    expect(onChangeSpy).not.toHaveBeenCalled();

    await user.tab();
    expect(onChangeSpy).toHaveBeenCalledWith(1);
    expect(input).toHaveValue('1');

    onChangeSpy.mockReset();
    await user.type(input, '1');
    expect(onChangeSpy).not.toHaveBeenCalled();

    await user.tab();
    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(input).toHaveValue('1');
  });

  describe('step buttons', () => {
    it('increase value when increment pressed', () => {
      let { incrementButton } = renderNumberField({
        defaultValue: 0,
        onChange: onChangeSpy,
      });

      firePress(incrementButton);
      expect(onChangeSpy).toHaveBeenCalledWith(1);
    });

    it('decrease value when decrement pressed', () => {
      let { decrementButton } = renderNumberField({
        defaultValue: 0,
        onChange: onChangeSpy,
      });

      firePress(decrementButton);
      expect(onChangeSpy).toHaveBeenCalledWith(-1);
    });

    it('observe step', () => {
      let { decrementButton, incrementButton } = renderNumberField({
        defaultValue: 0,
        step: 10,
        onChange: onChangeSpy,
      });

      firePress(decrementButton);
      expect(onChangeSpy).toHaveBeenCalledWith(-10);

      onChangeSpy.mockReset();
      firePress(incrementButton);
      expect(onChangeSpy).toHaveBeenCalledWith(0);
    });

    it('observe minValue when decrement pressed', () => {
      let { decrementButton } = renderNumberField({
        onChange: onChangeSpy,
        minValue: 3,
        value: 3,
      });

      firePress(decrementButton);
      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    it('observe maxValue when increment pressed', () => {
      let { incrementButton } = renderNumberField({
        onChange: onChangeSpy,
        maxValue: 3,
        value: 3,
      });

      firePress(incrementButton);
      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    it('can be hidden', () => {
      let { input, incrementButton, decrementButton } = renderNumberField({
        hideStepper: true,
      });

      expect(input).toBeDefined();
      expect(incrementButton).not.toBeDefined();
      expect(decrementButton).not.toBeDefined();
    });
  });
});
