import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/leases?communityId=&status=
router.get('/', requireAuth, async (req, res, next) => {
  const { communityId, status } = req.query;
  try {
    const conditions = ['l.unit_id = u.id'];
    const params = [];
    if (communityId) { params.push(communityId); conditions.push(`u.community_id=$${params.length}`); }
    if (status)      { params.push(status);       conditions.push(`l.status=$${params.length}`); }

    const result = await query(
      `SELECT l.id, l.unit_id, u.unit_number AS unit, b.name AS building,
              t.full_name AS tenant, l.start_date, l.end_date, l.monthly_rent,
              l.deposit, l.status,
              (l.end_date - CURRENT_DATE) AS days_remaining
       FROM leases l
       JOIN units u ON u.id = l.unit_id
       LEFT JOIN buildings b ON b.id = u.building_id
       LEFT JOIN tenants t ON t.id = l.tenant_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY l.end_date`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// GET /api/leases/expirations — count of leases expiring per month (6 months)
router.get('/expirations', requireAuth, async (req, res, next) => {
  const { communityId } = req.query;
  try {
    const params = [];
    const communityFilter = communityId
      ? (params.push(communityId), `AND u.community_id=$1`)
      : '';
    const result = await query(
      `SELECT to_char(end_date, 'Mon') AS month,
              COUNT(*)::int AS count,
              CASE
                WHEN COUNT(*) >= 10 THEN 'high'
                WHEN COUNT(*) >= 6  THEN 'medium'
                ELSE 'low'
              END AS risk
       FROM leases l
       JOIN units u ON u.id = l.unit_id
       WHERE l.status='active'
         AND l.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '6 months'
         ${communityFilter}
       GROUP BY to_char(end_date,'Mon'), date_trunc('month', end_date)
       ORDER BY date_trunc('month', end_date)`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// PATCH /api/leases/:id/renew
router.patch(
  '/:id/renew',
  requireAuth,
  requireRole('admin', 'manager'),
  body('newEndDate').isISO8601(),
  body('newRent').optional().isFloat({ min: 0 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { newEndDate, newRent } = req.body;
    try {
      const sets = ['end_date=$1'];
      const params = [newEndDate];
      if (newRent) { params.push(newRent); sets.push(`monthly_rent=$${params.length}`); }
      params.push(req.params.id);
      const result = await query(
        `UPDATE leases SET ${sets.join(', ')} WHERE id=$${params.length} RETURNING *`,
        params
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Lease not found' });
      res.json(result.rows[0]);
    } catch (err) { next(err); }
  }
);

export default router;
