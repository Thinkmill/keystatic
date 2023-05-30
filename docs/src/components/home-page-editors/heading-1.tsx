export function Heading1({
  plainLine1,
  plainLine2,
  fancy,
}: {
  plainLine1: string | null;
  plainLine2: string | null;
  fancy: string | null;
}) {
  return (
    <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl">
      {plainLine1}
      {plainLine2}
      <span className="relative">
        <svg
          className="absolute -right-3 -bottom-1.5 w-[110%]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 392 92"
          aria-hidden="true"
        >
          <path
            fill="#F7DE5B"
            d="m4.239.201 92.684 2.883 100.722 7.097 99.043 7.211 94.363 2.77-21.813 9.088 14.042 9.919 2.873 8.7-14.795 6.043 7.844 5.477 7.843 5.476-14.691 6.037 11.104 9.535 3.927 10.77-93.59-1.7-100.082-5.647-116.75-3.055-76.39-9.559 12.857-8.312-11.94-9.45 5.534-10.258-4.618-7.502 16.812-1.055L7.21 20.478l5.332-11.703L4.239.201Z"
          />
        </svg>
        <span className="relative">{fancy}</span>
      </span>
    </h1>
  );
}
