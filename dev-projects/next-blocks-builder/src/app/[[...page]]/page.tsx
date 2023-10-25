import { notFound } from 'next/navigation'
import { reader } from '@/keystatic/reader'
import { DocumentRenderer } from '@keystatic/core/renderer'

import { Heading } from '@/components/keystatic-renderer/Heading'
import { Testimonial } from '@/components/keystatic-renderer/Testimonial'
import { SurfaceContainer } from '@/components/keystatic-renderer/SurfaceContainer'
import { TwoColumns } from '@/components/keystatic-renderer/TwoColumns'

export default async function Page({ params }: { params: { page: string[] } }) {
  const pageSlug = params.page ? params.page.join('/') : 'homepage'
  const page = await reader.collections.pages.read(pageSlug, { resolveLinkedFiles: true })
  if (!page) notFound()
  return (
    <main>
      <h1 className="text-xl font-medium">Keystatic page builder test</h1>
      <div className="py-12">
        <DocumentRenderer
          document={page.content}
          renderers={{
            block: {
              heading: (props) => <Heading {...props} />,
            },
          }}
          componentBlocks={{
            section: (props) => <SurfaceContainer {...props} />,
            testimonial: (props) => <Testimonial {...props} />,
            twoColumns: (props) => <TwoColumns {...props} />,
            simpleText: (props) => (
              <>
                {console.dir(props, { depth: null })}
                <div {...props} />
              </>
            ),
          }}
        />
      </div>
      <pre>{JSON.stringify(page.content, null, 2)}</pre>
    </main>
  )
}
