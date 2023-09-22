export function PaperAirplaneIcon({
  ariaHidden = true,
}: {
  ariaHidden?: boolean;
}) {
  return (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden={ariaHidden}
    >
      <path d="M3.1 2.29a.75.75 0 0 0-.82.95l1.41 4.92a1.5 1.5 0 0 0 1.44 1.09h6.12a.75.75 0 0 1 0 1.5H5.13a1.5 1.5 0 0 0-1.44 1.09l-1.41 4.92a.75.75 0 0 0 .83.95 28.9 28.9 0 0 0 15.29-7.15.75.75 0 0 0 0-1.12A28.9 28.9 0 0 0 3.1 2.3z" />
    </svg>
  );
}
