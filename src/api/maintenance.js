import client, { API_URL } from './client.js';
import { maintenanceTickets as mockTickets } from '../mockData.js';

export async function fetchMaintenance({ communityId, status, priority } = {}) {
  if (!API_URL) {
    let data = mockTickets;
    if (status)   data = data.filter((t) => t.status === status);
    if (priority) data = data.filter((t) => t.priority === priority);
    return data;
  }
  const res = await client.get('/api/maintenance', { params: { communityId, status, priority } });
  return res.data;
}

export async function updateTicket(id, patch) {
  const res = await client.patch(`/api/maintenance/${id}`, patch);
  return res.data;
}
