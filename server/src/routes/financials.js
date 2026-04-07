import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/financials/summary?communityId=&month=&year=
router.get('/summary', requireAuth, async (req, res, next) => {
  const { communityId, month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
  try {
    const params = [month, year];
    const cFilter = communityId ? (params.push(communityId), `AND community_id=$${params.length}`) : '';

    const [payments, expenses] = await Promise.all([
      query(
        `SELECT
           SUM(amount_due)  AS total_due,
           SUM(amount_paid) AS total_collected,
           COUNT(*) FILTER (WHERE status='paid')     AS paid_count,
           COUNT(*) FILTER (WHERE status='partial')  AS partial_count,
           COUNT(*) FILTER (WHERE status='overdue')  AS overdue_count,
           COUNT(*) FILTER (WHERE status='upcoming') AS upcoming_count,
           SUM(late_fee)    AS total_late_fees
         FROM rent_payments
         WHERE EXTRACT(MONTH FROM due_date)=$1
           AND EXTRACT(YEAR  FROM due_date)=$2
           ${cFilter}`,
        params
      ),
      query(
        `SELECT category, SUM(amount) AS amount
         FROM expenses
         WHERE period_month=$1 AND period_year=$2 ${cFilter}
         GROUP BY category ORDER BY amount DESC`,
        params
      ),
    ]);

    const p = payments.rows[0];
    const totalDue = parseFloat(p.total_due || 0);
    const totalCollected = parseFloat(p.total_collected || 0);

    res.json({
      totalDue,
      totalCollected,
      collectionRate: totalDue > 0 ? Math.round((totalCollected / totalDue) * 100) : 0,
      paidCount: parseInt(p.paid_count, 10),
      partialCount: parseInt(p.partial_count, 10),
      overdueCount: parseInt(p.overdue_count, 10),
      upcomingCount: parseInt(p.upcoming_count, 10),
      totalLateFees: parseFloat(p.total_late_fees || 0),
      totalExpenses: expenses.rows.reduce((s, r) => s + parseFloat(r.amount), 0),
      expenseBreakdown: expenses.rows.map((r) => ({
        category: r.category,
        amount: parseFloat(r.amount),
        pct: 0, // calculated on client
      })),
    });
  } catch (err) { next(err); }
});

// GET /api/financials/payments?communityId=
router.get('/payments', requireAuth, async (req, res, next) => {
  const { communityId } = req.query;
  try {
    const params = [];
    const cFilter = communityId ? (params.push(communityId), `WHERE u.community_id=$1`) : '';
    const result = await query(
      `SELECT p.id, u.unit_number AS unit, t.full_name AS tenant,
              p.amount_due, p.amount_paid, p.status, p.due_date,
              p.paid_date, p.method, p.late_fee
       FROM rent_payments p
       JOIN units u ON u.id = p.unit_id
       LEFT JOIN tenants t ON t.id = p.tenant_id
       ${cFilter}
       ORDER BY p.due_date DESC, p.status`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// PATCH /api/financials/payments/:id/mark-paid
router.patch(
  '/payments/:id/mark-paid',
  requireAuth,
  requireRole('admin', 'manager'),
  body('amountPaid').isFloat({ min: 0 }),
  body('method').optional().isIn(['ACH', 'Card', 'Check', 'Cash']),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { amountPaid, method } = req.body;
    try {
      const result = await query(
        `UPDATE rent_payments
         SET amount_paid=$1, method=$2, paid_date=CURRENT_DATE,
             status = CASE WHEN $1 >= amount_due THEN 'paid' ELSE 'partial' END
         WHERE id=$3 RETURNING *`,
        [amountPaid, method || null, req.params.id]
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Payment not found' });
      res.json(result.rows[0]);
    } catch (err) { next(err); }
  }
);

export default router;
