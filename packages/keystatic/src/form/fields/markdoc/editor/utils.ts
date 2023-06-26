import { css, tokenSchema } from '@keystar/ui/style';
import { useRef, useCallback, useEffect } from 'react';

export const classes = {
  nodeInSelection: 'ProseMirror-nodeInSelection',
  nodeSelection: 'ProseMirror-selectednode',
  blockParent: 'ProseMirror-blockParent',
  focused: 'ProseMirror-focused',
};

export const markdocIdentifierPattern = /^[a-zA-Z][-_a-zA-Z0-9]*$/;

export function weakMemoize<Arg extends object, Return>(
  func: (arg: Arg) => Return
): (arg: Arg) => Return {
  const cache = new WeakMap<Arg, Return>();
  return (arg: Arg) => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    const result = func(arg);
    cache.set(arg, result);
    return result;
  };
}

export const nodeWithBorder = css({
  border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
  borderRadius: tokenSchema.size.radius.regular,
  [`&.${classes.nodeInSelection}, &.${classes.nodeSelection}`]: {
    borderColor: tokenSchema.color.alias.borderSelected,
    outline: 'none !important',
    boxShadow: `0 0 0 1px ${tokenSchema.color.alias.borderSelected}`,
  },
});

export const prosemirrorStyles = css`
  .ProseMirror {
    position: relative;
  }

  .ProseMirror {
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: 'liga' 0; /* the above doesn't seem to work in Edge */
  }

  .ProseMirror pre {
    white-space: pre-wrap;
  }

  .ProseMirror li {
    position: relative;
  }

  .ProseMirror-hideselection *::selection {
    background: transparent;
  }
  .ProseMirror-hideselection *::-moz-selection {
    background: transparent;
  }
  .ProseMirror-hideselection {
    caret-color: transparent;
  }

  .ProseMirror-selectednode {
    outline: 2px solid #8cf;
  }

  /* Make sure li selections wrap around markers */

  li.ProseMirror-selectednode {
    outline: none;
  }

  li.ProseMirror-selectednode:after {
    content: '';
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
  }

  /* Protect against generic img rules */

  img.ProseMirror-separator {
    display: inline !important;
    border: none !important;
    margin: 0 !important;
  }
  .ProseMirror-gapcursor {
    display: none;
    pointer-events: none;
    position: absolute;
  }

  .ProseMirror-gapcursor:after {
    content: '';
    display: block;
    position: absolute;
    top: -2px;
    width: 20px;
    border-top: 1px solid black;
    animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
  }

  @keyframes ProseMirror-cursor-blink {
    to {
      visibility: hidden;
    }
  }

  .ProseMirror-focused .ProseMirror-gapcursor {
    display: block;
  }
`;

export function useEventCallback<Func extends (...args: any) => any>(
  callback: Func
): Func {
  const callbackRef = useRef(callback);
  const cb = useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return cb as any;
}
