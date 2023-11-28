import { cx } from '../../utils';

const sharedBadgeClasses = cx(
  'rounded-full border px-1 py-0.5 text-[0.625rem] font-medium uppercase leading-none'
);

export function ComingSoonBadge() {
  return (
    <span
      className={cx(
        sharedBadgeClasses,
        'border-amber-5 bg-amber-2 text-amber-11'
      )}
    >
      Soon
    </span>
  );
}

export function NewBadge() {
  return (
    <span
      className={cx(
        sharedBadgeClasses,
        'border-purple-5 bg-purple-2 text-purple-11'
      )}
    >
      New
    </span>
  );
}
