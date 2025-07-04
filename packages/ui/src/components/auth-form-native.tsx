import React from 'react';
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

export function AuthForm({
  action,
  children,
  defaultEmail = '',
}: {
  action: string | ((formData: FormData) => void | Promise<void>);
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof action === 'function') {
      const formData = new FormData(e.currentTarget);
      await action(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Email Address
        </Label>

        <Input
          id="email"
          name="email"
          className="bg-muted text-md md:text-sm"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
        />
      </div>

      {children}
    </form>
  );
}