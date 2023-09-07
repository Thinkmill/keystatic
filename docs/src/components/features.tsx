import { StarIcon } from './icons/star-icon';

const features = [
  'First-class CMS experience',
  'TypeScript API',
  'Markdown & YAML/JSON based',
  'No database',
];

export default function Features() {
  return (
    <section className="relative bg-slate-3">
      <ul
        tabIndex={0}
        className="flex gap-4 overflow-x-auto px-6 py-8 md:gap-8"
        role="list"
      >
        {features.map(feature => (
          <li
            key={feature}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-slate-5 px-4 py-3 first:ml-auto last:mr-auto md:px-6 md:py-4"
          >
            <StarIcon size="small" />
            <span className="shrink-0 md:text-lg">{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
