import { useState } from 'react';
import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KeystarProvider } from '@keystar/ui/core';
import { NumberFieldInput } from './ui';

function renderNumberField({
  step,
  initialValue = null,
}: { step?: number; initialValue?: number | null } = {}) {
  const user = userEvent.setup();
  const committed: (number | null)[] = [];
  function Harness() {
    const [value, setValue] = useState<number | null>(initialValue);
    return (
      <NumberFieldInput
        label="Latitude"
        description={undefined}
        step={step}
        validation={undefined}
        value={value}
        onChange={val => {
          committed.push(val);
          setValue(val);
        }}
        autoFocus={false}
        forceValidation={false}
      />
    );
  }
  const result = render(
    <KeystarProvider locale="en-US">
      <Harness />
    </KeystarProvider>
  );
  const input = result.getByRole('textbox') as HTMLInputElement;
  return { user, input, committed };
}

test('keeps more than three fraction digits on commit', async () => {
  const { user, input, committed } = renderNumberField();
  await user.click(input);
  await user.keyboard('51.98771');
  await user.tab();
  expect(committed.at(-1)).toBe(51.98771);
  expect(input.value).toBe('51.98771');
});

test('keeps more than three fraction digits of an existing value', async () => {
  const { user, input, committed } = renderNumberField({
    initialValue: 5.8123456,
  });
  expect(input.value).toBe('5.8123456');
  await user.click(input);
  await user.tab();
  expect(committed).toEqual([]);
  expect(input.value).toBe('5.8123456');
});

test('keeps precision when step is smaller than 0.001', async () => {
  const { user, input, committed } = renderNumberField({ step: 0.00001 });
  await user.click(input);
  await user.keyboard('51.98771');
  await user.tab();
  expect(committed.at(-1)).toBe(51.98771);
});

test('integers are displayed and committed unchanged', async () => {
  const { user, input, committed } = renderNumberField();
  await user.click(input);
  await user.keyboard('1234567');
  await user.tab();
  expect(committed.at(-1)).toBe(1234567);
  expect(input.value).toBe('1,234,567');
});

test('step still rounds the committed value', async () => {
  const { user, input, committed } = renderNumberField({ step: 0.01 });
  await user.click(input);
  await user.keyboard('1.23456');
  await user.tab();
  expect(committed.at(-1)).toBe(1.23);
});
