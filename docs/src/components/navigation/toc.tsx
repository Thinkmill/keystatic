export function TableOfContents() {
  return (
    <div className="w-[12rem] sticky top-10 lg:top-32 self-start hidden md:block lg:hidden 2lg:block">
      <h5 className="text-xs uppercase text-stone-500">On this page</h5>

      <ul className="mt-2">
        <li>
          <a
            className="block text-sm text-stone-700 leading-tight py-1 font-semibold hover:underline"
            href="#"
          >
            Example
          </a>
        </li>

        <li>
          <a
            className="block text-sm text-stone-500 leading-tight py-1 hover:underline"
            href="#"
          >
            Example with really long label
          </a>
        </li>

        <li>
          <a
            className="block text-xs text-stone-500 pl-2 leading-tight py-1 hover:underline"
            href="#"
          >
            Example with really long label label label
          </a>
        </li>
      </ul>
    </div>
  );
}
