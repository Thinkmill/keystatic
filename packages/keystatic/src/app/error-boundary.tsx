import React, { ReactNode } from 'react';
import { isNotFoundError } from './not-found';

type ErrorBoundaryProps = {
  fallback: ReactNode | ((message: string) => ReactNode);
  children: ReactNode;
};

type ErrorBoundaryState = {
  message: string | null;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { message: null };
  }

  static getDerivedStateFromError(err: unknown) {
    if (isNotFoundError(err)) {
      throw err;
    }
    return { message: String(err) };
  }

  render() {
    if (this.state.message) {
      return typeof this.props.fallback === 'function'
        ? this.props.fallback(this.state.message)
        : this.props.fallback;
    }
    return this.props.children;
  }
}
