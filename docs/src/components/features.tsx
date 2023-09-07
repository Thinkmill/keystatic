import { CheckCircleIcon } from './icons/check-circle';

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
        className="mx-auto grid max-w-2xl grid-cols-2 gap-6 overflow-x-auto py-12"
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
