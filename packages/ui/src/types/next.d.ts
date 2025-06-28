// Type declarations for Next.js specific imports
// These should be provided by the consuming application

declare module 'next/link' {
  import { ComponentType, ReactNode } from 'react';
  
  interface LinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    [key: string]: any;
  }
  
  const Link: ComponentType<LinkProps>;
  export default Link;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
  };
  
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function redirect(url: string): never;
  export function useParams(): Record<string, string | string[]>;
}

declare module 'next/form' {
  import { ComponentType, FormHTMLAttributes } from 'react';
  
  interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    action?: string | ((formData: FormData) => void | Promise<void>);
  }
  
  const Form: ComponentType<FormProps>;
  export default Form;
}

declare module 'next-auth' {
  export interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      type: string;
    };
  }
  
  export interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  }
}

declare module 'next/image' {
  import { ComponentType, ImgHTMLAttributes } from 'react';
  
  interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
  }
  
  const Image: ComponentType<ImageProps>;
  export default Image;
}

declare module 'next-auth/react' {
  export function signOut(options?: { callbackUrl?: string }): Promise<void>;
  export function useSession(): {
    data: import('next-auth').Session | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  };
}