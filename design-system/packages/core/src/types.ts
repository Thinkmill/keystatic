import { ReactNode } from 'react';

import { LinkComponent } from '@voussoir/link';
import { RootStyleProps, VoussoirTheme } from '@voussoir/style';
import { ColorScheme, Emphasis, ScaleScheme } from '@voussoir/types';

type VoussoirContextProps = {
  /** Whether descendants should be displayed with the emphasized style. */
  emphasis?: Emphasis;
  /** Whether descendants should be disabled. */
  isDisabled?: boolean;
  /** Whether descendants should be displayed with the required style. */
  isRequired?: boolean;
  /** Whether descendants should be read only. */
  isReadOnly?: boolean;
  // /** Whether descendants should be displayed with the validation state style. */
  // validationState?: ValidationState;
};

export type VoussoirProviderProps = {
  /** The content of the Provider. */
  children: ReactNode;
  /**
   * The theme for your application.
   */
  // theme?: VoussoirTheme;
  /**
   * The color scheme for your application.
   * Defaults to operating system preferences.
   */
  colorScheme?: ColorScheme;
  /**
   * The default color scheme if no operating system setting is available.
   * @default 'light'
   */
  defaultColorScheme?: ColorScheme;
  /**
   * Sets the scale for your applications. Defaults based on device pointer type.
   */
  scale?: ScaleScheme;
  /**
   * The locale for your application as a [BCP 47](https://www.ietf.org/rfc/bcp/bcp47.txt) language code.
   * Defaults to the browser/OS language setting.
   * @default 'en-US'
   */
  locale?: string;
  /**
   * Customise links across your application. For client-side routing,
   * analytics, etc.
   */
  linkComponent?: LinkComponent;

  /**
   * The background color of the body element. This will only have an effect if the `VoussoirProvider` is rendered as the `html` element.
   */
  bodyBackground?: keyof VoussoirTheme['color']['background'];
} & VoussoirContextProps &
  RootStyleProps;

export type VoussoirProviderContext = {
  /**
   * The package version number of the nearest parent Provider.
   */
  version: string;
  /**
   * The theme of the nearest parent Provider.
   */
  // theme: VoussoirTheme;
  /**
   * The color scheme of the nearest parent Provider.
   */
  colorScheme: ColorScheme;
  /**
   * The scale of the nearest parent Provider.
   */
  scale: ScaleScheme;
} & VoussoirContextProps;
