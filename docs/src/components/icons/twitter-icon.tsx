export function TwitterIcon({ ariaHidden = true }: { ariaHidden?: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      aria-hidden={ariaHidden}
    >
      <path
        fill="currentColor"
        d="M9.309 6.928 14.406 1h-1.208L8.772 6.147 5.237 1H1.16l5.346 7.784L1.16 15h1.208l4.674-5.436L10.775 15h4.077L9.31 6.928ZM7.655 8.852l-.542-.775-4.31-6.167H4.66l3.478 4.977.541.775 4.521 6.47h-1.855l-3.69-5.28Z"
      />
    </svg>
  );
}
