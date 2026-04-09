import { Router } from 'express';
import { query } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/communities
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const communities = await query(
      `SELECT c.id, c.name, c.address, c.total_units, c.occupied_units,
              json_agg(json_build_object(
                'id', b.id, 'name', b.name,
                'units', b.total_units, 'occupied', b.occupied_units
              ) ORDER BY b.name) AS buildings
       FROM communities c
       LEFT JOIN buildings b ON b.community_id = c.id
       GROUP BY c.id
       ORDER BY c.id`
    );
    res.json(communities.rows);
  } catch (err) { next(err); }
});

// GET /api/communities/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT c.id, c.name, c.address, c.total_units, c.occupied_units,
              json_agg(json_build_object(
                'id', b.id, 'name', b.name,
                'units', b.total_units, 'occupied', b.occupied_units
              ) ORDER BY b.name) AS buildings
       FROM communities c
       LEFT JOIN buildings b ON b.community_id = c.id
       WHERE c.id=$1
       GROUP BY c.id`,
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Community not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

export default router;
