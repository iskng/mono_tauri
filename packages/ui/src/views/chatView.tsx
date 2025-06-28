'use client';

import { Chat } from '../components/chat';
import { DataStreamHandler } from '../components/data-stream-handler';

export interface ChatViewProps {
  id: string;
  initialMessages?: any[];
  selectedChatModel?: any;
  selectedVisibilityType?: 'public' | 'private';
  isReadonly?: boolean;
}

export function ChatView({
  id,
  initialMessages = [],
  selectedChatModel,
  selectedVisibilityType = 'private',
  isReadonly = false
}: ChatViewProps) {
  return (
    <DataStreamHandler id={id}>
      <Chat
        id={id}
        initialMessages={initialMessages}
        selectedChatModel={selectedChatModel}
        selectedVisibilityType={selectedVisibilityType}
        isReadonly={isReadonly}
      />
    </DataStreamHandler>
  );
}