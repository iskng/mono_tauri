// Type definitions for the UI package

import type { Message } from 'ai';

export type DataStreamDelta = {
  type: string;
  content?: any;
};

export interface DataPart {
  type: string;
  [key: string]: any;
}