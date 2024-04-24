import { cx } from '../../utils';

export type BadgeStatus = 'experimental' | 'new' | 'default';
type StyledStatuses = Exclude<BadgeStatus, 'default'>;

const badgeClasses: Record<StyledStatuses, string> = {
  experimental: 'border-amber-5 bg-amber-2 text-amber-11',
  new: 'border-purple-5 bg-purple-2 text-purple-11',
};

const sharedBadgeClasses = cx(
  'rounded-full border px-1 py-0.5 text-[0.625rem] font-medium uppercase leading-none'
);

function Badge({ variant, label }: { variant: BadgeStatus; label: string }) {
  return (
    <span
      className={cx(
        sharedBadgeClasses,
        variant !== 'default' ? badgeClasses[variant] : ''
      )}
    >
      {label}
    </span>
  );
}

export const NewBadge = () => <Badge variant="new" label="New" />;
export const ComingSoonBadge = () => (
  <Badge variant="experimental" label="Soon" />
);
export const DeprecatedBadge = () => (
  <Badge variant="experimental" label="Deprecated" />
);
