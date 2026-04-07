import client, { API_URL } from './client.js';
import { tenantMessages as mockMessages } from '../mockData.js';

export async function fetchMessages({ communityId, category } = {}) {
  if (!API_URL) {
    let data = mockMessages;
    if (category) data = data.filter((m) => m.category === category);
    return data;
  }
  const res = await client.get('/api/communications', { params: { communityId, category } });
  return res.data;
}

export async function markMessageRead(id) {
  if (!API_URL) return { ok: true };
  const res = await client.patch(`/api/communications/${id}/read`);
  return res.data;
}
