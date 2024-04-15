import {
  ActionBarProps as _ActionBarProps,
  ActionBarContainerProps as _ActionBarContainerProps,
} from '@react-types/actionbar';
import { BaseStyleProps } from '@keystar/ui/style';
import { DOMProps } from '@react-types/shared';

export type ActionBarProps<T> = _ActionBarProps<T> & DOMProps & BaseStyleProps;

export type ActionBarContainerProps = _ActionBarContainerProps &
  DOMProps &
  BaseStyleProps;
