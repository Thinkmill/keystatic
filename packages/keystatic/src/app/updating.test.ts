import { expect, test } from '@jest/globals';
import { formatPublishNoticeMessage } from './updating';

test('formatPublishNoticeMessage interpolates branch, sha, and slug placeholders', () => {
  const formatted = formatPublishNoticeMessage(
    'Saved to {branch} ({sha}) for {slug} — deployment takes ~2 minutes.',
    {
      branch: 'main',
      sha: 'abc1234',
      slug: 'hello-world',
    }
  );
  expect(formatted).toBe(
    'Saved to main (abc1234) for hello-world — deployment takes ~2 minutes.'
  );
});

test('formatPublishNoticeMessage leaves static messages unchanged and handles omitted optional fields', () => {
  const formatted = formatPublishNoticeMessage(
    'Changes committed to {branch}. Site rebuilds automatically ({slug}).',
    {
      branch: 'staging',
    }
  );
  expect(formatted).toBe(
    'Changes committed to staging. Site rebuilds automatically ().'
  );
});
