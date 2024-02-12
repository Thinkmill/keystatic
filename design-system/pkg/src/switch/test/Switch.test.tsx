import userEvent from '@testing-library/user-event';
import { jest, describe, afterEach, expect, it } from '@jest/globals';

import { renderWithProvider } from '#test-utils';

import { Switch, SwitchProps } from '..';

describe('switch/Switch', () => {
  let user = userEvent.setup();
  let onChangeSpy = jest.fn();

  afterEach(() => {
    onChangeSpy.mockClear();
  });

  function renderSwitch(props: SwitchProps = {}) {
    return renderWithProvider(<Switch onChange={onChangeSpy} {...props} />);
  }

  it('can be toggled (uncontrolled)', async () => {
    let children = 'Toggle me';
    let { getByLabelText } = renderSwitch({ children });

    let checkbox = getByLabelText(children) as HTMLInputElement;
    expect(checkbox.value).toBe('on'); // default value
    expect(checkbox.checked).toBeFalsy();
    expect(onChangeSpy).not.toHaveBeenCalled();

    await user.click(checkbox);
    expect(checkbox.checked).toBeTruthy();
    expect(onChangeSpy).toHaveBeenCalledWith(true);

    await user.click(checkbox);
    expect(onChangeSpy).toHaveBeenCalledWith(false);
  });

  it('can be default checked (uncontrolled)', async () => {
    let children = 'Toggle me';
    let value = 'subscribe';
    let { getByLabelText } = renderSwitch({
      children,
      value,
      defaultSelected: true,
    });

    let checkbox = getByLabelText(children) as HTMLInputElement;
    expect(checkbox.value).toBe(value);
    expect(checkbox.checked).toBeTruthy();

    await user.click(checkbox);
    expect(checkbox.checked).toBeFalsy();
    expect(onChangeSpy).toHaveBeenCalledWith(false);
  });

  it('can be controlled', async () => {
    let children = 'Toggle me';
    let { getByLabelText, rerender } = renderSwitch({
      children,
      isSelected: true,
    });

    let checkbox = getByLabelText(children) as HTMLInputElement;
    expect(checkbox.checked).toBeTruthy();

    await user.click(checkbox);
    expect(checkbox.checked).toBeTruthy();
    expect(onChangeSpy).toHaveBeenCalledWith(false);

    rerender(<Switch children={children} isSelected={false} />);
    expect(checkbox.checked).toBeFalsy();
  });

  it('can be disabled', async () => {
    let children = 'Toggle me';
    let { getByLabelText } = renderSwitch({ children });

    let checkbox = getByLabelText(children) as HTMLInputElement;
    expect(checkbox.checked).toBeFalsy();

    userEvent.click(checkbox);
    expect(checkbox.checked).toBeFalsy();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it('supports non-visible label', async () => {
    let children = 'Toggle me';
    let ariaLabel = 'not visible';
    let { getByRole } = renderSwitch({ 'aria-label': ariaLabel, children });

    let checkbox = getByRole('switch');
    expect(checkbox).toHaveAttribute('aria-label', ariaLabel);
  });

  it('supports aria-labelledby', async () => {
    let id = 'test';
    let { getByRole } = renderWithProvider(
      <>
        <span id={id}>Test</span>
        <Switch aria-labelledby={id} />
      </>
    );

    let checkbox = getByRole('switch');
    expect(checkbox).toHaveAttribute('aria-labelledby', id);
  });

  it('supports aria-describedby', async () => {
    let testId = 'target';
    let { getByTestId } = renderWithProvider(<Switch data-testid={testId} />);
    let checkboxLabel = getByTestId(testId);
    expect(checkboxLabel).toBeInTheDocument();
  });
});
