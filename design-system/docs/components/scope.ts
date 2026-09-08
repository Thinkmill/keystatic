// @ts-ignore
import * as componentsFromPackages from '../generated/components';
import { allIcons } from '@keystar/ui/icon/all';
import * as exampleHelpers from './example-helpers';
import * as internationalizedDate from '@internationalized/date';
import { useCollator } from 'react-aria/useCollator';
import { useDateFormatter } from 'react-aria/useDateFormatter';
import { useFilter } from 'react-aria/useFilter';
import { useListFormatter } from 'react-aria/useListFormatter';
import { useLocale } from 'react-aria/I18nProvider';
import { useNumberFormatter } from 'react-aria/useNumberFormatter';

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
