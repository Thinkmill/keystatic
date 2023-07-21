export default function Storytelling() {
  return (
    <section className="relative bg-keystatic-gray-light">
      <div className="relative mx-auto max-w-4xl px-6 md:pt-6 pb-6 sm:pb-12 lg:pb-16">
        <iframe
          className="w-full aspect-video max-w-full rounded-lg shadow"
          src="https://www.youtube.com/embed/E65Fx9all04?controls=0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </section>
  );
}
