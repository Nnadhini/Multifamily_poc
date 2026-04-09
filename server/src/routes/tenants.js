import { Router } from 'express';
import { query } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/tenants?communityId=
router.get('/', requireAuth, async (req, res, next) => {
  const { communityId } = req.query;
  try {
    const params = [];
    const where = communityId ? (params.push(communityId), 'WHERE t.community_id=$1') : '';
    const result = await query(
      `SELECT t.id, t.full_name AS name, t.email, t.phone, t.status,
              u.unit_number AS unit, b.name AS building,
              u.rent,
              l.end_date AS lease_end,
              (SELECT COUNT(*) FROM rent_payments p WHERE p.tenant_id=t.id AND p.status='overdue') AS overdue_count
       FROM tenants t
       LEFT JOIN units u ON u.id = t.unit_id
       LEFT JOIN buildings b ON b.id = u.building_id
       LEFT JOIN leases l ON l.unit_id = t.unit_id AND l.status='active'
       ${where}
       ORDER BY t.full_name`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// GET /api/tenants/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT t.*, u.unit_number AS unit, b.name AS building, l.start_date, l.end_date AS lease_end, l.monthly_rent
       FROM tenants t
       LEFT JOIN units u ON u.id=t.unit_id
       LEFT JOIN buildings b ON b.id=u.building_id
       LEFT JOIN leases l ON l.unit_id=t.unit_id AND l.status='active'
       WHERE t.id=$1`,
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Tenant not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

export default router;
