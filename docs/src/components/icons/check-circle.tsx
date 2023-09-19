export function CheckCircleIcon({
  ariaHidden = true,
}: {
  ariaHidden?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0"
      aria-hidden={ariaHidden}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.25 12a9.75 9.75 0 1 1 19.5 0 9.75 9.75 0 0 1-19.5 0Zm13.36-1.81a.75.75 0 1 0-1.22-.88l-3.24 4.53-1.62-1.62a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.1l3.75-5.24Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
