import Form from 'next/form';

// TODO: signOut should be provided by the consuming app
// import { signOut } from '@/app/(auth)/auth';

export const SignOutForm = () => {
  return (
    <Form
      className="w-full"
      action="#" // TODO: This should be replaced with a server action from the consuming app
    >
      <button
        type="submit"
        className="w-full text-left px-1 py-0.5 text-red-500"
      >
        Sign out
      </button>
    </Form>
  );
};
