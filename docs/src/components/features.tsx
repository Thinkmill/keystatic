import { CheckCircleIcon } from './icons/check-circle';

const features = [
  'First-class CMS experience',
  'Markdown & YAML/JSON based',
  'TypeScript API',
  'No database',
];

export default function Features() {
  return (
    <section className="relative bg-sand-3">
      <ul
        tabIndex={0}
        className="mx-auto grid max-w-2xl grid-cols-2 gap-6 overflow-x-auto pb-12 pt-24"
        role="list"
      >
        {features.map(feature => (
          <li key={feature} className="flex shrink-0 items-center gap-4">
            <CheckCircleIcon />
            <span className="shrink-0 md:text-lg">{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
