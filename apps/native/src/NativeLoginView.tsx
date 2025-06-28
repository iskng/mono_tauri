import { LoginView } from '@repo/ui/views/loginView-native';
import { Button } from '@repo/ui/components/button';

interface NativeLoginViewProps {
  action: (formData: FormData) => Promise<any>;
  onGuestLogin: () => Promise<void>;
}

export function NativeLoginView({ action, onGuestLogin }: NativeLoginViewProps) {
  return (
    <div className="relative">
      <LoginView action={action} />
      <div className="flex flex-col items-center mt-6 px-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <Button
          onClick={onGuestLogin}
          variant="outline"
          className="w-full max-w-md mt-4"
        >
          Continue as Guest
        </Button>
      </div>
    </div>
  );
}