import { Router } from 'express';
import { query } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/communications?communityId=&category=
router.get('/', requireAuth, async (req, res, next) => {
  const { communityId, category } = req.query;
  try {
    const conditions = [];
    const params = [];
    if (communityId) { params.push(communityId); conditions.push(`m.community_id=$${params.length}`); }
    if (category)    { params.push(category);    conditions.push(`m.category=$${params.length}`); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT m.id, t.full_name AS tenant, u.unit_number AS unit,
              m.category, m.subject, m.preview, m.is_unread, m.is_priority, m.sent_at
       FROM messages m
       LEFT JOIN tenants t ON t.id = m.tenant_id
       LEFT JOIN units u ON u.id = t.unit_id
       ${where}
       ORDER BY m.sent_at DESC`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// PATCH /api/communications/:id/read
router.patch('/:id/read', requireAuth, async (req, res, next) => {
  try {
    await query('UPDATE messages SET is_unread=false WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
