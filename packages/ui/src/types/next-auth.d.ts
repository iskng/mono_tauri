import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: 'guest' | 'regular' | 'free' | 'pro' | 'enterprise';
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    email?: string | null;
    type: 'guest' | 'regular' | 'free' | 'pro' | 'enterprise';
  }
}