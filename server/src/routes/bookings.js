import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/bookings?communityId=&status=&stage=
router.get('/', requireAuth, async (req, res, next) => {
  const { communityId, status, stage } = req.query;
  try {
    const conditions = [];
    const params = [];
    if (communityId) { params.push(communityId); conditions.push(`community_id=$${params.length}`); }
    if (status)      { params.push(status);       conditions.push(`status=$${params.length}`); }
    if (stage)       { params.push(stage);        conditions.push(`stage=$${params.length}`); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT id, name, email, phone, source, status, stage,
              interested_in, budget_min, budget_max, tour_date,
              follow_up_date, ai_score, notes, touchpoints,
              days_in_pipeline, assigned_to, created_at
       FROM leads ${where}
       ORDER BY ai_score DESC NULLS LAST`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// PATCH /api/bookings/:id — update stage or status
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'manager'),
  body('stage').optional().trim(),
  body('status').optional().isIn(['hot', 'warm', 'cold']),
  body('notes').optional().trim(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { stage, status, notes } = req.body;
    const sets = [];
    const params = [];
    if (stage  !== undefined) { params.push(stage);  sets.push(`stage=$${params.length}`); }
    if (status !== undefined) { params.push(status); sets.push(`status=$${params.length}`); }
    if (notes  !== undefined) { params.push(notes);  sets.push(`notes=$${params.length}`); }
    if (sets.length === 0) return res.status(400).json({ error: 'No fields to update' });

    params.push(req.params.id);
    try {
      const result = await query(
        `UPDATE leads SET ${sets.join(', ')} WHERE id=$${params.length} RETURNING *`,
        params
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Lead not found' });
      res.json(result.rows[0]);
    } catch (err) { next(err); }
  }
);

export default router;
