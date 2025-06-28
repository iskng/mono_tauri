'use client';

import { useState } from 'react';
import { LoaderIcon } from '@repo/ui/components/icons';
import { Button } from "@repo/ui/components/button";

export function SubmitButton({
  children,
  isSuccessful,
}: {
  children: React.ReactNode;
  isSuccessful: boolean;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Button
      type="submit"
      aria-disabled={isSubmitting || isSuccessful}
      disabled={isSubmitting || isSuccessful}
      className="relative"
      onClick={() => setIsSubmitting(true)}
    >
      {children}

      {(isSubmitting || isSuccessful) && (
        <span className="animate-spin absolute right-4">
          <LoaderIcon />
        </span>
      )}

      <output aria-live="polite" className="sr-only">
        {isSubmitting || isSuccessful ? 'Loading' : 'Submit form'}
      </output>
    </Button>
  );
}