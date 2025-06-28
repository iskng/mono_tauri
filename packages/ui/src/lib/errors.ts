// Error classes for the UI package

export class ChatSDKError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ChatSDKError';
  }
}