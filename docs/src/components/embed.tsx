export type EmbedProps = {
  mediaType: 'video' | 'audio';
  embedCode: string;
};

const mediaTypeClasses: Record<EmbedProps['mediaType'], string> = {
  video: '[&>iframe]:aspect-video [&>iframe]:w-full',
  audio: '[&>iframe]:w-full',
};

export function Embed({ mediaType, embedCode }: EmbedProps) {
  return (
    <div
      className={mediaTypeClasses[mediaType]}
      dangerouslySetInnerHTML={{ __html: embedCode }}
    />
  );
}
