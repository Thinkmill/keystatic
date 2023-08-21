import { ReactElement, ReactNode } from 'react';
import { BaseStyleProps } from '@keystar/ui/style';
import { DOMProps } from '@react-types/shared';

export type CursorState = 'horizontal' | 'horizontal-max' | 'horizontal-min';
export type ResizeActivity =
  | 'initializing'
  | 'pointer'
  | 'keyboard'
  | undefined;
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
  /** Control the collapsed state of the primary pane. */
  isCollapsed?: boolean;
  /** The minimum size of the primary pane, in pixels. */
  minSize: number;
  /** The minimum size of the primary pane, in pixels. */
  maxSize: number;
  /**
   * Callback that is called when the user collapses or expands the primary
   * pane. A _collapse_ event is triggered when the primary pane is dragged beyond
   * half its minimum size, or the user presses the `Enter` key while the resize
   * handle is focused.
   *
   * Because we visually hide the resize handle (unless focused) to complete the
   * collapsed appearance, an _expand_ event will only occur when the user
   * presses the `Enter` key on a collapsed resize handle—you MUST implement an
   * alternative "expand" interaction for pointer users.
   */
  onCollapseChange?: (isCollapsed: boolean) => void;
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
