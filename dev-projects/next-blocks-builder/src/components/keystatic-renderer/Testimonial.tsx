import Image from 'next/image';

import { cx } from '@/utils';
import { reader } from '@/keystatic/reader';

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
    <figure className="not-prose flex place-items-center gap-12">
      <div
        className={cx(
          'group-data-[surface=dark]/surface:text-transparent group-data-[surface=dark]/surface:bg-gradient-to-br group-data-[surface=dark]/surface:from-lime-400 group-data-[surface=dark]/surface:to-emerald-400 group-data-[surface=dark]/surface:bg-clip-text',
          'group-data-[surface=dark-subtle]/surface:text-white',
          'group-data-[surface=light]/surface:text-black',
          'group-data-[surface=light-subtle]/surface:text-slate-700',
          'surface-'
        )}
      >
        {testimonial.avatar && (
          <Image
            className="h-64 w-auto rounded mb-4"
            src={testimonial.avatar}
            alt=""
            width={320}
            height={180}
          />
        )}
        <blockquote
          className={cx(
            'text-2xl font-normal font-serif italic md:text-2xl lg:text-3xl lg:leading-[130%] max-w-xl'
          )}
        >
          {testimonial.quote}
        </blockquote>
        <p className="mt-2">~ {testimonial.name}</p>
      </div>
      <div className="absolute right-4 top-0 h-12 w-12 -translate-y-1/2 lg:right-20" />
    </figure>
  );
}
