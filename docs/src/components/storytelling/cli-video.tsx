export default function CliVideo() {
  return (
    <section className="relative bg-keystatic-gray-light">
      <div className="max-w-4xl px-6 py-6 sm:pb-12 lg:pb-16 mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Two-way editing, effortlessly
          </h2>

          <p className="mt-4 sm:mt-6 text-lg">
            Create a new Next.js or Astro project in seconds with the Keystatic
            CLI:
          </p>
        </div>
        <div className="pt-4 md:pt-6">
          <iframe
            className="w-full aspect-video max-w-full rounded-lg shadow"
            src="https://www.youtube.com/embed/E65Fx9all04?controls=0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
