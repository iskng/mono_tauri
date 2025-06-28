// Temporary type definitions for UI package
// These should be imported from a shared types package or passed as props

export interface Suggestion {
  id: string;
  documentId: string;
  documentCreatedAt: Date;
  originalText: string;
  suggestedText: string;
  description: string | null;
  isResolved: boolean;
  userId: string;
  createdAt: Date;
}

export interface Vote {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
}

export interface Chat {
  id: string;
  createdAt: Date;
  title: string;
  userId: string;
  visibility: 'public' | 'private';
}

export interface User {
  id: string;
  email: string;
  password?: string | null;
}

export interface Document {
  id: string;
  createdAt: Date;
  title: string;
  content?: string | null;
  kind: 'text' | 'code' | 'image' | 'sheet';
  userId: string;
}