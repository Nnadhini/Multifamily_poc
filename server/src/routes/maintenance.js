import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/maintenance?communityId=&status=&priority=
router.get('/', requireAuth, async (req, res, next) => {
  const { communityId, status, priority } = req.query;
  try {
    const conditions = [];
    const params = [];
    if (communityId) { params.push(communityId); conditions.push(`m.community_id=$${params.length}`); }
    if (status)      { params.push(status);       conditions.push(`m.status=$${params.length}`); }
    if (priority)    { params.push(priority);     conditions.push(`m.priority=$${params.length}`); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT m.id, u.unit_number AS unit, b.name AS building, t.full_name AS tenant,
              m.category, m.description, m.priority, m.status, m.assigned_to,
              m.estimated_cost, m.actual_cost, m.days_open,
              m.created_at, m.updated_at
       FROM maintenance_tickets m
       LEFT JOIN units u ON u.id = m.unit_id
       LEFT JOIN buildings b ON b.id = u.building_id
       LEFT JOIN tenants t ON t.id = m.tenant_id
       ${where}
       ORDER BY
         CASE m.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
         m.created_at DESC`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// PATCH /api/maintenance/:id — update status or assignedTo
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'manager', 'maintenance'),
  body('status').optional().isIn(['open', 'in-progress', 'scheduled', 'resolved']),
  body('assignedTo').optional().trim(),
  body('actualCost').optional().isFloat({ min: 0 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { status, assignedTo, actualCost } = req.body;
    const sets = [];
    const params = [];
    if (status     !== undefined) { params.push(status);     sets.push(`status=$${params.length}`); }
    if (assignedTo !== undefined) { params.push(assignedTo); sets.push(`assigned_to=$${params.length}`); }
    if (actualCost !== undefined) { params.push(actualCost); sets.push(`actual_cost=$${params.length}`); }
    if (sets.length === 0) return res.status(400).json({ error: 'No fields to update' });

    params.push(req.params.id);
    try {
      const result = await query(
        `UPDATE maintenance_tickets SET ${sets.join(', ')} WHERE id=$${params.length} RETURNING *`,
        params
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Ticket not found' });
      res.json(result.rows[0]);
    } catch (err) { next(err); }
  }
);

export default router;
