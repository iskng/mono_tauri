'use client';

import { Link } from "@repo/ui/components/platform-adapters";
import { AuthForm } from '../components/auth-form';
import { SubmitButton } from '../components/submit-button';

export interface RegisterViewProps {
  action: (formData: FormData) => Promise<any>;
}

export function RegisterView({ action }: RegisterViewProps) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign Up</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Create an account with your email and password
          </p>
        </div>
        <AuthForm action={action} defaultEmail="">
          <SubmitButton isSuccessful={false}>Sign up</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {'Already have an account? '}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign in
            </Link>
            {' instead.'}
          </p>
        </AuthForm>
      </div>
    </div>
  );
}