import { SurfaceContainer, SurfaceProps } from './SurfaceContainer';

export function TwoColumns({
  left,
  right,
  surface,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  surface: SurfaceProps;
}) {
  return (
    <SurfaceContainer surface={surface}>
      <div className="flex gap-12 justify-between items-center">
        <div className="flex-1">{left}</div>
        <div className="flex-1">{right}</div>
      </div>
    </SurfaceContainer>
  );
}
