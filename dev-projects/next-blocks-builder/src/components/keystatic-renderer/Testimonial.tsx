import Image from 'next/image';

import { cx } from '../../utils';
import { reader } from '../../keystatic/reader';

type Testimonial = string;

export async function Testimonial({
  testimonial: testimonialSlug,
}: {
  testimonial: Testimonial;
}) {
  const testimonial =
    await reader.collections.testimonials.read(testimonialSlug);
  if (!testimonial) {
    throw new Error(`Testimonial not found: ${testimonialSlug}`);
  }
  return (
    <figure className="not-prose flex flex-col @5xl:flex-row gap-4 @5xl:gap-8 text-left items-start">
      {testimonial.image && (
        <Image
          className="shrink-0 h-20 w-20 @5xl:h-24 @5xl:w-24 @7xl:h-32 @7xl:w-32 rounded-lg object-cover @5xl:mb-4"
          src={testimonial.image}
          alt=""
          width={96}
          height={96}
        />
      )}
      <div
        className={cx(
          /*
            Surface-aware color classes (see `addVariants` plugin in tailwind config!)
          */
          // White
          'surface-white:text-black',
          // Off-white
          'surface-off-white:text-slate-700',
          // Black
          'surface-black:text-transparent surface-black:bg-gradient-to-r surface-black:from-cyan-300 surface-black:to-sky-500 surface-black:bg-clip-text',
          // Off-black
          'surface-off-black:text-slate-300',
          // Splash
          'surface-splash:text-cyan-900'
        )}
      >
        <blockquote
          className={cx('text-2xl font-serif italic @5xl:text-3xl max-w-xl')}
        >
          {testimonial.quote}
        </blockquote>
        <p className="mt-2">~ {testimonial.name}</p>
      </div>
    </figure>
  );
}
