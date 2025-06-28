// User entitlements for AI features

export interface Entitlements {
  availableChatModelIds: string[];
  maxTokens?: number;
  maxChats?: number;
}

export const entitlementsByUserType: Record<string, Entitlements> = {
  free: {
    availableChatModelIds: ['chat-model'],
    maxTokens: 10000,
    maxChats: 10,
  },
  pro: {
    availableChatModelIds: ['chat-model', 'chat-model-reasoning'],
    maxTokens: 100000,
    maxChats: 100,
  },
  enterprise: {
    availableChatModelIds: ['chat-model', 'chat-model-reasoning'],
    maxTokens: undefined, // unlimited
    maxChats: undefined, // unlimited
  },
};