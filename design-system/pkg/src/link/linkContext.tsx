import { assert } from 'emery';
import {
  AnchorHTMLAttributes,
  ForwardRefRenderFunction,
  FunctionComponent,
  Ref,
  createContext,
  forwardRef,
  useContext,
} from 'react';

export interface LinkComponentProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const makeLinkComponent = (
  render: ForwardRefRenderFunction<HTMLAnchorElement, LinkComponentProps>
) => ({ __forwardRef__: forwardRef(render) } as const);

export type LinkComponent =
  | ReturnType<typeof makeLinkComponent>
  | FunctionComponent<LinkComponentProps>;

export const DefaultLinkComponent = makeLinkComponent((props, ref) => (
  <a ref={ref} {...props} />
));

export const LinkComponentContext =
  createContext<LinkComponent>(DefaultLinkComponent);

export const useLinkComponent = (ref: Ref<HTMLAnchorElement>) => {
  const linkComponent = useContext(LinkComponentContext);

  assert(
    !ref || '__forwardRef__' in linkComponent,
    `You're passing a ref to a Keystar UI link, but your app is providing a custom link component to 'VoussoirProvider' that doesn't appear to support refs.

To fix this, you need to use Keystar UI's 'makeLinkComponent' helper function when creating your custom link component. This ensures that refs are forwarded correctly, and allows us to silence this error message.
    `
  );

  if ('__forwardRef__' in linkComponent) {
    return linkComponent.__forwardRef__;
  }

  return linkComponent;
};
