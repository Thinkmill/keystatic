import React, { ReactNode } from 'react';
import { useRouter } from './router';

class NotFoundError extends Error {
  constructor() {
    super('Not found');
    this.name = 'NotFoundError';
  }
}

export function isNotFoundError(err: unknown): err is NotFoundError {
  return (
    typeof err === 'object' && err !== null && err instanceof NotFoundError
  );
}

export function notFound(): never {
  throw new NotFoundError();
}

type InnerProps = {
  fallback: ReactNode;
  children: ReactNode;
  href: string;
};

type InnerState = { notFound: boolean; lastHref: string };

class NotFoundErrorBoundaryInner extends React.Component<
  InnerProps,
  InnerState
> {
  constructor(props: InnerProps) {
    super(props);
    this.state = {
      notFound: false,
      lastHref: props.href,
    };
  }

  static getDerivedStateFromError(err: unknown) {
    if (isNotFoundError(err)) {
      return { notFound: true };
    }
    throw err;
  }

  static getDerivedStateFromProps(
    props: InnerProps,
    state: InnerState
  ): InnerState {
    if (props.href !== state.lastHref && state.notFound) {
      return { notFound: false, lastHref: props.href };
    }
    return { notFound: state.notFound, lastHref: props.href };
  }

  render() {
    if (this.state.notFound) return this.props.fallback;
    return this.props.children;
  }
}

export function NotFoundBoundary(props: {
  fallback: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  return <NotFoundErrorBoundaryInner {...props} href={router.href} />;
}
