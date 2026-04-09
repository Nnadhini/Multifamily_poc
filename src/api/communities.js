import client, { API_URL } from './client.js';
import { communities as mockCommunities } from '../mockData.js';

export async function fetchCommunities() {
  if (!API_URL) return mockCommunities;
  const res = await client.get('/api/communities');
  return res.data;
}

export async function fetchCommunity(id) {
  if (!API_URL) return mockCommunities.find((c) => c.id === id) ?? null;
  const res = await client.get(`/api/communities/${id}`);
  return res.data;
}
