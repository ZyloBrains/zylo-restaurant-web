import { headers } from 'next/headers';
import { API_BASE_URL } from '@/lib/constants/env';
import type { PublicRestaurant, PublicTenant } from './types';

async function fetchWithTenant<T>(path: string): Promise<T> {
  const headerStore = await headers();
  // Fallback for local development
  const host = headerStore.get('host') ?? 'fishstation.localhost:3000';

  // Fix: Use standard template literals and ensure path starts with /
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      // Map the frontend host to the backend host
      'X-Forwarded-Host': host, 
      'Host': host.replace(':3000', ':8080'),
    },
    next: { revalidate: 0 }, // Next.js way to say 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  return response.json();
}

export async function getPublicTenant() {
  return fetchWithTenant<PublicTenant>('/api/v1/public/tenant');
}

export async function getPublicRestaurant() {
  return fetchWithTenant<PublicRestaurant>('/api/v1/public/restaurant');
}
