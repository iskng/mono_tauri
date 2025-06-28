// User entitlements for AI features

export interface Entitlements {
  availableChatModelIds: string[];
  maxTokens?: number;
  maxChats?: number;
}

export const entitlementsByUserType: Record<string, Entitlements> = {
  free: {
    availableChatModelIds: ['grok-beta', 'grok-2-mini'],
    maxTokens: 10000,
    maxChats: 10,
  },
  pro: {
    availableChatModelIds: ['grok-beta', 'grok-2-mini', 'grok-2'],
    maxTokens: 100000,
    maxChats: 100,
  },
  enterprise: {
    availableChatModelIds: ['grok-beta', 'grok-2-mini', 'grok-2'],
    maxTokens: undefined, // unlimited
    maxChats: undefined, // unlimited
  },
};