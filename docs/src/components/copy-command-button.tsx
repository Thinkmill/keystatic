'use client';

import { useState } from 'react';
import { copyTextToClipboard } from '../utils';
import Button from './button';

export function CopyCommandButton() {
  const copyCommandText = 'npm install @keystatic';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCommand = () => {
    copyTextToClipboard(copyCommandText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Button
      className="border-keystatic-gray items-center py-0"
      impact="light"
      onClick={handleCopyCommand}
      aria-label="Copy npm command for creating a Keystatic project"
    >
      <div className="flex gap-4 font-mono text-sm items-center leading-none">
        {copyCommandText}

        {isCopied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-green-800 shrink-0"
            fill="none"
            shapeRendering="geometricPrecision"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 shrink-0"
            fill="none"
            shapeRendering="geometricPrecision"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 17C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3H13C13.7403 3 14.3866 3.4022 14.7324 4M11 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H11C9.89543 7 9 7.89543 9 9V19C9 20.1046 9.89543 21 11 21Z" />
          </svg>
        )}
      </div>
    </Button>
  );
}
