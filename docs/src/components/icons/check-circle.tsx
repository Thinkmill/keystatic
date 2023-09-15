export function CheckCircleIcon({
  ariaHidden = true,
}: {
  ariaHidden?: boolean;
}) {
  return (
    // TODO: Create size and color prop for fill and stroke to be able to assign token colors on consumption.
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-6 w-6 shrink-0"
      viewBox="0 0 24 24"
      aria-hidden={ariaHidden}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="#203c25"
        strokeWidth="1.5"
        fill="#b7dfba"
      />
      <path
        stroke="#203c25"
        strokeLinecap="square"
        strokeWidth="1.5"
        d="M9 12.75 11.25 15 15 9.75"
      />
    </svg>
  );
}
