// Platform-agnostic router hooks
import { useCallback } from 'react';

export interface RouterAdapter {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  pathname: string;
}

// Default implementation for non-Next.js environments
export const useRouter = (): RouterAdapter => {
  return {
    push: (path: string) => {
      console.log('Router push:', path);
      // In Tauri app, you might handle navigation differently
    },
    replace: (path: string) => {
      console.log('Router replace:', path);
    },
    back: () => {
      console.log('Router back');
    },
    pathname: typeof window !== 'undefined' ? window.location.pathname : '/'
  };
};

export const useParams = () => {
  // Return empty params for non-Next.js environments
  return {};
};

export const useSearchParams = () => {
  // Return empty search params for non-Next.js environments
  return new URLSearchParams();
};
