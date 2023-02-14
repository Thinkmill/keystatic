import { markGlobalsImported } from './injectVoussoirStyles';
import { VoussoirProviderProps } from './types';
import { VoussoirProvider } from './VoussoirProvider';

export function TestProvider(props: VoussoirProviderProps) {
  markGlobalsImported();
  return <VoussoirProvider {...props} />;
}
