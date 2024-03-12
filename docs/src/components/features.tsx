import { CheckCircleIcon } from './icons/check-circle';

const features = [
  {
    label: 'First-class CMS experience',
    bgColor: 'bg-pink-2',
    textColor: 'text-pink-9',
  },
  {
    label: 'Markdown & YAML/JSON based',
    bgColor: 'bg-yellow-2',
    textColor: 'text-yellow-9',
  },
  {
    label: 'TypeScript API',
    bgColor: 'bg-green-2',
    textColor: 'text-green-9',
  },
  {
    label: 'No database',
    bgColor: 'bg-cyan-2',
    textColor: 'text-cyan-9',
  },
  {
    label: 'Markdoc & MDX support',
    bgColor: 'bg-violet-2',
    textColor: 'text-violet-9',
  },
];

export default function Features() {
  return (
    <section className="relative bg-white">
      <ul
        tabIndex={0}
        className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4 px-6 pb-12 pt-24 sm:gap-x-6"
        role="list"
      >
        {features.map(feature => (
          <li
            key={feature.label}
            className={`flex items-center gap-2 rounded-full ${feature.bgColor} p-2 pr-4 ${feature.textColor}`}
          >
            <CheckCircleIcon />
            <span className="text-sand-12">{feature.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
