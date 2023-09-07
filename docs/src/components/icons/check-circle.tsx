export function CheckCircleIcon({
  ariaHidden = true,
}: {
  ariaHidden?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      className="h-6 w-6"
      viewBox="0 0 24 24"
      aria-hidden={ariaHidden}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
      />
    </svg>
  );
}
