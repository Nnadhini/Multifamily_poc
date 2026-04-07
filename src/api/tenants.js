import client, { API_URL } from './client.js';
import { units as mockUnits } from '../mockData.js';

// Derive mock tenants from units that have a tenant name
const mockTenants = mockUnits
  .filter((u) => u.tenant)
  .map((u, i) => ({
    id: i + 1,
    name: u.tenant,
    unit: u.unit,
    building: u.building,
    rent: u.rent,
    lease_end: u.leaseEnd,
    status: 'active',
  }));

export async function fetchTenants({ communityId } = {}) {
  if (!API_URL) return mockTenants;
  const res = await client.get('/api/tenants', { params: { communityId } });
  return res.data;
}

export async function fetchTenant(id) {
  if (!API_URL) return mockTenants.find((t) => t.id === id) ?? null;
  const res = await client.get(`/api/tenants/${id}`);
  return res.data;
}
