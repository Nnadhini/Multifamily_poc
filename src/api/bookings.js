import client, { API_URL } from './client.js';
import { crmLeads as mockLeads } from '../mockData.js';

export async function fetchBookings({ communityId, status, stage } = {}) {
  if (!API_URL) {
    let data = mockLeads;
    if (status) data = data.filter((l) => l.status === status);
    if (stage)  data = data.filter((l) => l.stage === stage);
    return data;
  }
  const res = await client.get('/api/bookings', { params: { communityId, status, stage } });
  return res.data;
}

export async function updateLead(id, patch) {
  const res = await client.patch(`/api/bookings/${id}`, patch);
  return res.data;
}
