// Additional React type declarations

declare module 'react' {
  export function useOptimistic<T>(
    passthrough: T,
    reducer?: (state: T, action: any) => T
  ): [T, (action: any) => void];
}

declare module 'react-dom' {
  export function useFormStatus(): {
    pending: boolean;
    data: FormData | null;
    method: string | null;
    action: string | null;
  };
}