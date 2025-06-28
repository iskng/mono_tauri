import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from 'nanoid';
import type { Document } from '@repo/ui/lib/db/schema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID() {
  return nanoid();
}

export async function fetcher<T = any>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
}

export async function fetchWithErrorHandlers(
  url: string | URL | Request, 
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(url, init);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }
  
  return response;
}

export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/\n+/g, ' ')
    .replace(/[\t\r]+/g, ' ')
    .replace(/\s+/g, ' ');
}

export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}
