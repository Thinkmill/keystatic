export default function CliVideo() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto grid max-w-5xl grid-cols-12 gap-6 px-6 py-12 sm:pb-12">
        <div className="col-start-1 col-end-5 py-8">
          <h2 className="text-2xl font-medium">
            Two-way editing, effortlessly with the Keystatic CLI
          </h2>
          <p className="mt-4 text-base">
            Create a new Next.js or Astro project in seconds with the Keystatic
            CLI
          </p>
        </div>
        <div className="col-span-7 col-start-6">
          <iframe
            className="aspect-video w-full max-w-full rounded-lg shadow"
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
