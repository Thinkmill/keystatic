// @ts-ignore
import * as componentsFromPackages from '../generated/components';
import { allIcons } from '@voussoir/icon/all';
import * as exampleHelpers from './example-helpers';

export const scope: Record<string, unknown> = {
  ...componentsFromPackages,
  ...allIcons,
  ...exampleHelpers,
};
