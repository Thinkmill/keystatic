import { ReactElement, ReactNode } from 'react';
import { BaseStyleProps } from '@keystar/ui/style';
import { DOMProps } from '@react-types/shared';

export type CursorState = 'horizontal' | 'horizontal-max' | 'horizontal-min';
export type ResizeEvent = KeyboardEvent | MouseEvent | TouchEvent;
export type SplitViewStorage = {
  getItem(name: string): string | null;
  setItem(name: string, value: string): void;
};

export type SplitViewProps = {
  /** Unique ID used to auto-save the pane arrangement. */
  autoSaveId?: string;
  /** The primary and secondary split panes. */
  children: [ReactElement, ReactElement];
  /** The default size of the primary pane, in pixels. */
  defaultSize: number;
  /** The minimum size of the primary pane, in pixels. */
  minSize: number;
  /** The minimum size of the primary pane, in pixels. */
  maxSize: number;
  /** Callback that is called when the user resizes the panes. */
  onResize?: (value: number) => void;
  /**
   * Custom storage API.
   * @default localStorage
   */
  storage?: SplitViewStorage;
} & DOMProps &
  BaseStyleProps;

export type SplitPanePrimaryProps = { children: ReactNode } & DOMProps &
  BaseStyleProps;
export type SplitPaneSecondaryProps = { children: ReactNode } & DOMProps &
  BaseStyleProps;
