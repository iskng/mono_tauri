import React, { ReactNode } from 'react';
import { RouterContext } from '@repo/ui/components/platform-adapters';

export function RouterProvider({ 
  children, 
  navigate 
}: { 
  children: ReactNode;
  navigate: (path: string) => void;
}) {
  return (
    <RouterContext.Provider value={{ navigate }}>
      {children}
    </RouterContext.Provider>
  );
}