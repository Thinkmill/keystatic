import { expect, test } from '@jest/globals';
import { date } from './index';

test('parses UTC midnight Date instances into YYYY-MM-DD', () => {
  const field = date({ label: 'Publish Date', validation: { isRequired: true } });
  const parsed = field.parse(new Date('2026-09-01T00:00:00.000Z'));
  expect(parsed).toBe('2026-09-01');
  expect(field.validate(parsed)).toBe('2026-09-01');
});

test('does not silently truncate Date instances carrying a non-zero UTC time (#1615)', () => {
  const field = date({ label: 'Publish Date', validation: { isRequired: true } });
  const parsed = field.parse(new Date('2026-09-01T13:00:00.000Z'));
  expect(parsed).toBe('2026-09-01T13:00:00.000Z');
  expect(() => field.validate(parsed)).toThrow('Publish Date is not a valid date');
});
