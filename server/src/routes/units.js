import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/units?communityId=&buildingId=&status=
router.get('/', requireAuth, async (req, res, next) => {
  const { communityId, buildingId, status } = req.query;
  try {
    const conditions = [];
    const params = [];

    if (communityId) { params.push(communityId); conditions.push(`u.community_id=$${params.length}`); }
    if (buildingId)  { params.push(buildingId);  conditions.push(`u.building_id=$${params.length}`); }
    if (status)      { params.push(status);       conditions.push(`u.status=$${params.length}`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await query(
      `SELECT u.id, u.unit_number AS unit, b.name AS building, u.unit_type AS type,
              u.sqft, u.rent, u.market_rent, u.status, u.days_vacant, u.tour_score,
              t.full_name AS tenant,
              (SELECT end_date FROM leases l WHERE l.unit_id=u.id AND l.status='active' LIMIT 1) AS lease_end
       FROM units u
       LEFT JOIN buildings b ON b.id = u.building_id
       LEFT JOIN tenants t ON t.unit_id = u.id AND t.status='active'
       ${where}
       ORDER BY u.unit_number`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// GET /api/units/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.*, b.name AS building_name, t.full_name AS tenant_name,
              l.start_date, l.end_date AS lease_end, l.monthly_rent AS lease_rent
       FROM units u
       LEFT JOIN buildings b ON b.id = u.building_id
       LEFT JOIN tenants t ON t.unit_id = u.id AND t.status='active'
       LEFT JOIN leases l ON l.unit_id = u.id AND l.status='active'
       WHERE u.id=$1`,
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Unit not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// PATCH /api/units/:id  — update rent or status
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'manager'),
  body('rent').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(['occupied', 'vacant', 'maintenance', 'pending']),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { rent, status } = req.body;
    const sets = [];
    const params = [];
    if (rent   !== undefined) { params.push(rent);   sets.push(`rent=$${params.length}`); }
    if (status !== undefined) { params.push(status); sets.push(`status=$${params.length}`); }
    if (sets.length === 0) return res.status(400).json({ error: 'No fields to update' });

    params.push(req.params.id);
    try {
      const result = await query(
        `UPDATE units SET ${sets.join(', ')} WHERE id=$${params.length} RETURNING *`,
        params
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Unit not found' });
      res.json(result.rows[0]);
    } catch (err) { next(err); }
  }
);

export default router;
