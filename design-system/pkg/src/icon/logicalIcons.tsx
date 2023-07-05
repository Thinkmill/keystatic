import { useLocale } from '@react-aria/i18n';

import { IconProps } from '@keystar/ui/types';

import { Icon } from './Icon';

import { arrowLeftIcon } from './icons/arrowLeftIcon';
import { arrowRightIcon } from './icons/arrowRightIcon';

import { chevronLeftIcon } from './icons/chevronLeftIcon';
import { chevronRightIcon } from './icons/chevronRightIcon';

export const ArrowEndIcon = (props: Omit<IconProps, 'src'>) => {
  const { direction } = useLocale();
  const icon = direction === 'rtl' ? arrowLeftIcon : arrowRightIcon;
  return <Icon src={icon} {...props} />;
};
export const ArrowStartIcon = (props: Omit<IconProps, 'src'>) => {
  const { direction } = useLocale();
  const icon = direction === 'rtl' ? arrowRightIcon : arrowLeftIcon;
  return <Icon src={icon} {...props} />;
};

export const ChevronEndIcon = (props: Omit<IconProps, 'src'>) => {
  const { direction } = useLocale();
  const icon = direction === 'rtl' ? chevronLeftIcon : chevronRightIcon;
  return <Icon src={icon} {...props} />;
};
export const ChevronStartIcon = (props: Omit<IconProps, 'src'>) => {
  const { direction } = useLocale();
  const icon = direction === 'rtl' ? chevronRightIcon : chevronLeftIcon;
  return <Icon src={icon} {...props} />;
};
