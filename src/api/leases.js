import client, { API_URL } from './client.js';
import { leaseExpirations as mockExpirations, units as mockUnits } from '../mockData.js';

// Derive mock leases from units with occupied status
const mockLeases = mockUnits
  .filter((u) => u.status === 'occupied' && u.leaseEnd)
  .map((u, i) => ({
    id: i + 1,
    unit: u.unit,
    building: u.building,
    tenant: u.tenant,
    end_date: u.leaseEnd,
    monthly_rent: u.rent,
    status: 'active',
    days_remaining: Math.ceil((new Date(u.leaseEnd) - new Date()) / 86400000),
  }));

export async function fetchLeases({ communityId, status } = {}) {
  if (!API_URL) {
    if (status) return mockLeases.filter((l) => l.status === status);
    return mockLeases;
  }
  const res = await client.get('/api/leases', { params: { communityId, status } });
  return res.data;
}

export async function fetchLeaseExpirations({ communityId } = {}) {
  if (!API_URL) return mockExpirations;
  const res = await client.get('/api/leases/expirations', { params: { communityId } });
  return res.data;
}

export async function renewLease(id, { newEndDate, newRent }) {
  const res = await client.patch(`/api/leases/${id}/renew`, { newEndDate, newRent });
  return res.data;
}
