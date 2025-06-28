import { useState, useEffect } from 'react';
import { Chat } from '@repo/ui/components/chat';
import { DataStreamHandler } from '@repo/ui/components/data-stream-handler';
import { SidebarProvider } from '@repo/ui/components/sidebar';
import { AppSidebar } from '@repo/ui/components/app-sidebar';
import { SidebarInset } from '@repo/ui/components/sidebar';
import { generateUUID } from '@repo/ui/lib/utils';
import { useApiConfig } from '@repo/ui/lib/network-config';
import { DEFAULT_CHAT_MODEL } from '@repo/ui/lib/ai/models';
import { RegisterView } from '@repo/ui/views/registerView-native';
import type { Session } from 'next-auth';
import { RouterProvider } from './router-context';
import { NativeLoginView } from './NativeLoginView';

type ViewState = 'login' | 'register' | 'chat';

function App() {
  const [chatId] = useState(() => generateUUID());
  const { apiBaseUrl } = useApiConfig();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewState>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, [apiBaseUrl]);

  const checkExistingSession = async () => {
    try {
      // For native app, we'll use a mock session for now
      // In production, you'd implement proper token-based auth
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to check session:', error);
      setIsLoading(false);
    }
  };

  const handleLogin = async (formData: FormData) => {
    setAuthError(null);
    try {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      // Create a mock session for development
      // In production, implement proper token-based authentication
      const mockSession: Session = {
        user: {
          id: 'user-' + Date.now(),
          email: email,
          name: email.split('@')[0],
          type: 'guest',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      setSession(mockSession);
      setView('chat');
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('Login failed. Please try again.');
    }
  };

  const handleGuestLogin = async () => {
    setAuthError(null);
    try {
      // Create a guest session
      const guestSession: Session = {
        user: {
          id: 'guest-' + Date.now(),
          email: 'guest@tauri.app',
          name: 'Guest User',
          type: 'guest',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      setSession(guestSession);
      setView('chat');
    } catch (error) {
      console.error('Guest login error:', error);
      setAuthError('Failed to create guest session.');
    }
  };

  const handleRegister = async (formData: FormData) => {
    setAuthError(null);
    try {
      // For now, just switch to login view
      // In production, this would call the registration endpoint
      setView('login');
    } catch (error) {
      console.error('Register error:', error);
      setAuthError('Registration failed. Please try again.');
    }
  };

  // Handle navigation for auth views
  const handleNavigate = (path: string) => {
    if (path === '/register') {
      setView('register');
    } else if (path === '/login') {
      setView('login');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show login/register view if not authenticated
  if (!session || view !== 'chat') {
    return (
      <RouterProvider navigate={handleNavigate}>
        <div>
          {authError && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
              {authError}
            </div>
          )}
          {view === 'register' ? (
            <RegisterView action={handleRegister} />
          ) : (
            <NativeLoginView action={handleLogin} onGuestLogin={handleGuestLogin} />
          )}
        </div>
      </RouterProvider>
    );
  }

  // Show chat interface when authenticated
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <Chat
          key={chatId}
          id={chatId}
          initialMessages={[]}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialVisibilityType="private"
          isReadonly={false}
          session={session}
          autoResume={false}
        />
        <DataStreamHandler id={chatId} />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;