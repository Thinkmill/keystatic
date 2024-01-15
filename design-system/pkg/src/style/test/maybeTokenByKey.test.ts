import { maybeTokenByKey } from '@keystar/ui/style';
import { expect, describe, it } from '@jest/globals';

describe('style/maybeTokenByKey', function () {
  describe('number', function () {
    it('100', function () {
      let value = maybeTokenByKey('', 100);
      expect(value).toBe(100);
    });
  });

  describe('units', function () {
    it('%', function () {
      let value = maybeTokenByKey('', '100%');
      expect(value).toBe('100%');
    });
    it('vh', function () {
      let value = maybeTokenByKey('', '100vh');
      expect(value).toBe('100vh');
    });
  });

  describe('variables', function () {
    it('regular space', function () {
      let value = maybeTokenByKey('size.space', 'regular');
      expect(value).toBe('var(--kui-size-space-regular)');
    });
    it('neutral border', function () {
      let value = maybeTokenByKey('color.border', 'neutral');
      expect(value).toBe('var(--kui-color-border-neutral)');
    });
    it('medium font weight', function () {
      let value = maybeTokenByKey('typography.fontWeight', 'bold');
      expect(value).toBe('var(--kui-typography-font-weight-bold)');
    });
    it('size.container.small', function () {
      let value = maybeTokenByKey('', 'size.container.small');
      expect(value).toBe('var(--kui-size-container-small)');
    });
    it('color.alias.foregroundDisabled', function () {
      let value = maybeTokenByKey('', 'color.alias.foregroundDisabled');
      expect(value).toBe('var(--kui-color-alias-foreground-disabled)');
    });
  });
});
