export function DiscordIcon({ ariaHidden = true }: { ariaHidden?: boolean }) {
  return (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      aria-hidden={ariaHidden}
    >
      <g clip-path="url(#a)">
        <path
          fill="#000"
          d="M13.553 3.005A13.334 13.334 0 0 0 10.253 2c-.156.276-.298.56-.423.85a12.42 12.42 0 0 0-3.664 0A8.975 8.975 0 0 0 5.744 2 13.43 13.43 0 0 0 2.44 3.007C.351 6.066-.215 9.05.068 11.99A13.36 13.36 0 0 0 4.116 14c.328-.436.618-.9.867-1.384a8.65 8.65 0 0 1-1.365-.645c.115-.082.227-.166.335-.249a9.594 9.594 0 0 0 8.094 0c.11.089.222.173.335.25a8.69 8.69 0 0 1-1.368.646c.249.484.539.946.867 1.382a13.3 13.3 0 0 0 4.051-2.01c.332-3.41-.568-6.365-2.379-8.985Zm-8.21 7.176c-.79 0-1.442-.709-1.442-1.58 0-.872.63-1.587 1.439-1.587s1.456.715 1.442 1.586c-.014.872-.636 1.58-1.44 1.58Zm5.315 0c-.79 0-1.44-.709-1.44-1.58 0-.872.63-1.587 1.44-1.587.81 0 1.452.715 1.438 1.586-.014.872-.634 1.58-1.438 1.58Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 2h16v12H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
