// AI model definitions

export interface ChatModel {
  id: string;
  name: string;
  description: string;
  provider: string;
}

export const chatModels: ChatModel[] = [
  {
    id: 'grok-beta',
    name: 'xAI Grok Beta',
    description: 'Fast and capable model from xAI',
    provider: 'xai',
  },
  {
    id: 'grok-2-mini',
    name: 'xAI Grok 2 Mini',
    description: 'Lightweight model for faster responses',
    provider: 'xai',
  },
  {
    id: 'grok-2',
    name: 'xAI Grok 2',
    description: 'Advanced model with enhanced capabilities',
    provider: 'xai',
  },
];