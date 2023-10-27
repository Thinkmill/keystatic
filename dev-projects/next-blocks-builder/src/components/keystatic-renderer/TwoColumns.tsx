import { Container, type LayoutProps } from './Container';

export function TwoColumns({
  left,
  right,
  layoutProps,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  layoutProps: LayoutProps;
}) {
  return (
    <Container layoutProps={layoutProps}>
      <div className="flex gap-12 justify-between items-start">
        <div className="flex-1">{left}</div>
        <div className="flex-1">{right}</div>
      </div>
    </Container>
  );
}
