import client, { API_URL } from './client.js';
import { rentPayments as mockPayments, expenseBreakdown as mockExpenses } from '../mockData.js';

export async function fetchFinancialSummary({ communityId, month, year } = {}) {
  if (!API_URL) {
    const totalDue = mockPayments.reduce((s, p) => s + p.amountDue, 0);
    const totalCollected = mockPayments.reduce((s, p) => s + p.amountPaid, 0);
    return {
      totalDue,
      totalCollected,
      collectionRate: totalDue > 0 ? Math.round((totalCollected / totalDue) * 100) : 0,
      paidCount: mockPayments.filter((p) => p.status === 'paid').length,
      partialCount: mockPayments.filter((p) => p.status === 'partial').length,
      overdueCount: mockPayments.filter((p) => p.status === 'overdue').length,
      upcomingCount: mockPayments.filter((p) => p.status === 'upcoming').length,
      totalLateFees: mockPayments.reduce((s, p) => s + (p.lateFee || 0), 0),
      totalExpenses: mockExpenses.reduce((s, e) => s + e.amount, 0),
      expenseBreakdown: mockExpenses,
    };
  }
  const res = await client.get('/api/financials/summary', { params: { communityId, month, year } });
  return res.data;
}

export async function fetchPayments({ communityId } = {}) {
  if (!API_URL) return mockPayments;
  const res = await client.get('/api/financials/payments', { params: { communityId } });
  return res.data;
}

export async function markPaymentPaid(id, { amountPaid, method }) {
  const res = await client.patch(`/api/financials/payments/${id}/mark-paid`, { amountPaid, method });
  return res.data;
}
