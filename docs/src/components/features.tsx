import { CheckCircleIcon } from './icons/check-circle';

// TODO: Implament mapping function to include color variation, if neccessary. Currently have flattened the list.
// const features = [
//   'First-class CMS experience',
//   'Markdown & YAML/JSON based',
//   'TypeScript API',
//   'No database',
// ];

export default function Features() {
  return (
    <section className="relative bg-white">
      <ul
        tabIndex={0}
        className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 px-6 pb-12 pt-24 sm:gap-x-6"
        role="list"
      >
        {/* {features.map(feature => ( */}
        <li
          key="First-class CMS experience"
          className="flex items-center gap-2 rounded-full bg-pink-2 p-2 pr-4 text-pink-9"
        >
          <CheckCircleIcon />
          <span className="text-sand-12">First-class CMS experience</span>
        </li>
        {/* ))} */}
        {/* {features.map(feature => ( */}
        <li
          key="Markdown & YAML/JSON based"
          className="flex items-center gap-2 rounded-full bg-yellow-2 p-2 pr-4 text-yellow-9"
        >
          <CheckCircleIcon />
          <span className="text-sand-12">Markdown & YAML/JSON based</span>
        </li>
        {/* ))} */}
        {/* {features.map(feature => ( */}
        <li
          key="TypeScript API"
          className="flex items-center gap-2 rounded-full bg-green-2 p-2 pr-4 text-green-9"
        >
          <CheckCircleIcon />
          <span className="text-sand-12">TypeScript API</span>
        </li>
        {/* ))} */}
        {/* {features.map(feature => ( */}
        <li
          key="No database"
          className="flex items-center gap-2 rounded-full bg-cyan-2 p-2 pr-4 text-cyan-9"
        >
          <CheckCircleIcon />
          <span className="text-sand-12">No database</span>
        </li>
        {/* ))} */}
      </ul>
    </section>
  );
}
