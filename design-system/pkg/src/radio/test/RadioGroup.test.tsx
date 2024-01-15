import { expect, it, describe, afterEach, jest } from '@jest/globals';
// import userEvent from '@testing-library/user-event';

import { fireEvent, renderWithProvider } from '#test-utils';

import { Radio, RadioGroup, RadioGroupProps } from '..';

function renderRadioGroup(
  props: Partial<RadioGroupProps> = {},
  radioProps = [{}, {}, {}]
) {
  return renderWithProvider(
    <RadioGroup label="Favourite marsupial" {...props}>
      <Radio value="bilby" {...radioProps[0]}>
        Bilby
      </Radio>
      <Radio value="kangaroo" {...radioProps[1]}>
        Kangaroo
      </Radio>
      <Radio value="quokka" {...radioProps[2]}>
        Quokka
      </Radio>
    </RadioGroup>
  );
}

describe('radio/RadioGroup', () => {
  let onChangeSpy = jest.fn();

  afterEach(() => {
    onChangeSpy.mockClear();
  });

  it('handles defaults', () => {
    let { getByRole, getAllByRole, getByLabelText } = renderRadioGroup({
      onChange: onChangeSpy,
    });

    let radioGroup = getByRole('radiogroup');
    let radios = getAllByRole('radio') as HTMLInputElement[];
    expect(radioGroup).toBeTruthy();
    expect(radios.length).toBe(3);

    let groupName = radios[0].getAttribute('name');
    radios.forEach(radio => {
      expect(radio).toHaveAttribute('name', groupName);
    });

    expect(radios[0].value).toBe('bilby');
    expect(radios[1].value).toBe('kangaroo');
    expect(radios[2].value).toBe('quokka');

    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(false);

    let bilby = getByLabelText('Bilby');
    fireEvent.click(bilby);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith('bilby');

    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(false);
  });

  it('can be given a name', () => {
    let name = 'customName';
    let { getAllByRole } = renderRadioGroup({ name });

    let radios = getAllByRole('radio');
    radios.forEach(radio => {
      expect(radio).toHaveAttribute('name', name);
    });
  });

  it('can be disabled', () => {
    let { getByRole, getAllByRole } = renderRadioGroup({ isDisabled: true });

    let radioGroup = getByRole('radiogroup');
    let radios = getAllByRole('radio');
    expect(radioGroup).toBeTruthy();
    expect(radios.length).toBe(3);
    expect(radios[0]).toHaveAttribute('disabled');
    expect(radios[1]).toHaveAttribute('disabled');
    expect(radios[2]).toHaveAttribute('disabled');
  });

  it('can have a single disabled radio', () => {
    let { getByRole, getByText, getAllByRole } = renderRadioGroup(
      {
        onChange: onChangeSpy,
      },
      [{}, { isDisabled: true }, {}]
    );

    let radioGroup = getByRole('radiogroup');
    let radios = getAllByRole('radio', { exact: true }) as HTMLInputElement[];
    expect(radioGroup).toBeTruthy();
    expect(radios.length).toBe(3);
    expect(radios[0]).not.toHaveAttribute('disabled');
    expect(radios[1]).toHaveAttribute('disabled');
    expect(radios[2]).not.toHaveAttribute('disabled');

    let bilby = getByText('Bilby');
    let kangaroo = getByText('Kangaroo');
    fireEvent.click(kangaroo);
    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(false);
    fireEvent.click(bilby);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith('bilby');
    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(false);
  });

  it('can have a default value', () => {
    let { getByRole, getByLabelText, getAllByRole } = renderRadioGroup({
      defaultValue: 'quokka',
      onChange: onChangeSpy,
    });

    let radioGroup = getByRole('radiogroup');
    let radios = getAllByRole('radio') as HTMLInputElement[];
    expect(radioGroup).toBeTruthy();
    expect(radios.length).toBe(3);
    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(true);

    let bilby = getByLabelText('Bilby');
    fireEvent.click(bilby);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith('bilby');
    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(false);
  });

  it('can be controlled', () => {
    let { getByRole, getByLabelText, getAllByRole } = renderRadioGroup({
      value: 'quokka',
      onChange: onChangeSpy,
    });

    let radioGroup = getByRole('radiogroup');
    let radios = getAllByRole('radio') as HTMLInputElement[];
    expect(radioGroup).toBeTruthy();
    expect(radios.length).toBe(3);
    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(true);

    let bilby = getByLabelText('Bilby');
    fireEvent.click(bilby);
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith('bilby');
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(false);
    expect(radios[2].checked).toBe(true);
  });
});
