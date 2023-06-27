export type EmbedProps = {
  mediaType: 'video' | 'tweet';
  embedCode: string;
};

const mediaTypeClasses: Record<EmbedProps['mediaType'], string> = {
  video: '[&>iframe]:aspect-video [&>iframe]:w-full my-2',
  tweet: 'flex justify-center my-2', // can't control twitter embed width so centering it
};

export function Embed({ mediaType, embedCode }: EmbedProps) {
  return (
    <div
      className={mediaTypeClasses[mediaType]}
      dangerouslySetInnerHTML={{ __html: embedCode }}
    />
  );
}
