import client, { API_URL } from './client.js';
import { units as mockUnits } from '../mockData.js';

export async function fetchUnits({ communityId, buildingId, status } = {}) {
  if (!API_URL) {
    let data = mockUnits;
    if (status) data = data.filter((u) => u.status === status);
    return data;
  }
  const res = await client.get('/api/units', { params: { communityId, buildingId, status } });
  return res.data;
}

export async function fetchUnit(id) {
  if (!API_URL) return mockUnits.find((u) => u.id === id) ?? null;
  const res = await client.get(`/api/units/${id}`);
  return res.data;
}

export async function updateUnit(id, patch) {
  const res = await client.patch(`/api/units/${id}`, patch);
  return res.data;
}
