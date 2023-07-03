// @ts-ignore
import * as componentsFromPackages from '../generated/components';
import { allIcons } from '@keystar/ui/icon/all';
import * as exampleHelpers from './example-helpers';
import * as internationalizedDate from '@internationalized/date';
import {
  useCollator,
  useDateFormatter,
  useFilter,
  useListFormatter,
  useLocale,
  useNumberFormatter,
} from '@react-aria/i18n';

export const scope: Record<string, unknown> = {
  ...componentsFromPackages,
  ...allIcons,
  ...exampleHelpers,
  ...internationalizedDate,
  useCollator,
  useDateFormatter,
  useFilter,
  useListFormatter,
  useLocale,
  useNumberFormatter,
};
