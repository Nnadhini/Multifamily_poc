import client, { API_URL } from './client.js';
import { applicants as mockApplicants, equipmentHealth as mockEquipment, atRiskUnits as mockAtRisk, units as mockUnits } from '../mockData.js';

export async function fetchScreeningApplicants({ communityId } = {}) {
  if (!API_URL) return mockApplicants;
  const res = await client.get('/api/ai/screening', { params: { communityId } });
  return res.data;
}

export async function updateApplicantStatus(id, status) {
  const res = await client.patch(`/api/ai/screening/${id}`, { status });
  return res.data;
}

export async function fetchVacancyRisk({ communityId } = {}) {
  if (!API_URL) return mockAtRisk;
  const res = await client.get('/api/ai/vacancy-risk', { params: { communityId } });
  return res.data;
}

export async function fetchEquipmentHealth({ communityId } = {}) {
  if (!API_URL) return mockEquipment;
  const res = await client.get('/api/ai/equipment', { params: { communityId } });
  return res.data;
}

export async function fetchDynamicPricing({ communityId } = {}) {
  if (!API_URL) {
    return mockUnits.map((u) => ({
      id: u.id,
      unit: u.unit,
      building: u.building,
      type: u.type,
      current_rent: u.rent,
      market_rent: u.marketRent,
      suggested_rent: Math.min(u.marketRent * 0.98, u.rent * 1.05),
      status: u.status,
    }));
  }
  const res = await client.get('/api/ai/pricing', { params: { communityId } });
  return res.data;
}

export async function sendChatMessage({ message, communityId }) {
  if (!API_URL) {
    return {
      reply: `[Demo mode] You asked: "${message}". Connect VITE_API_URL to a running backend to enable live AI responses.`,
      timestamp: new Date().toISOString(),
    };
  }
  const res = await client.post('/api/ai/chat', { message, communityId });
  return res.data;
}
