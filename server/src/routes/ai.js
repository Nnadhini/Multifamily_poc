import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// ── Tenant Screening ──────────────────────────────────────────────────────────

// GET /api/ai/screening?communityId=
router.get('/screening', requireAuth, async (req, res, next) => {
  const { communityId } = req.query;
  try {
    const params = [];
    const filter = communityId
      ? (params.push(communityId), `WHERE u.community_id=$1`)
      : '';
    const result = await query(
      `SELECT a.id, a.name, u.unit_number AS unit, a.applied_date, a.credit_score,
              a.monthly_income, a.income_ratio, a.rental_history, a.employment,
              a.ai_score, a.risk_level, a.status, a.flags, a.recommendation
       FROM applicants a
       LEFT JOIN units u ON u.id = a.unit_id
       ${filter}
       ORDER BY a.applied_date DESC`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// PATCH /api/ai/screening/:id
router.patch(
  '/screening/:id',
  requireAuth,
  requireRole('admin', 'manager'),
  body('status').isIn(['pending', 'approved', 'conditional', 'declined']),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const result = await query(
        'UPDATE applicants SET status=$1 WHERE id=$2 RETURNING *',
        [req.body.status, req.params.id]
      );
      if (result.rowCount === 0) return res.status(404).json({ error: 'Applicant not found' });
      res.json(result.rows[0]);
    } catch (err) { next(err); }
  }
);

// ── Vacancy Predictor ─────────────────────────────────────────────────────────

// GET /api/ai/vacancy-risk?communityId=
router.get('/vacancy-risk', requireAuth, async (req, res, next) => {
  const { communityId } = req.query;
  try {
    const params = [];
    const filter = communityId ? (params.push(communityId), 'AND t.community_id=$1') : '';
    // Derive a simple rule-based risk score from lease end proximity + open maintenance tickets
    const result = await query(
      `SELECT t.full_name AS tenant, u.unit_number AS unit,
              l.end_date AS lease_end,
              (l.end_date - CURRENT_DATE) AS days_remaining,
              CASE
                WHEN (l.end_date - CURRENT_DATE) <= 30  THEN 78
                WHEN (l.end_date - CURRENT_DATE) <= 60  THEN 55
                WHEN (l.end_date - CURRENT_DATE) <= 90  THEN 40
                ELSE 20
              END AS move_out_probability,
              u.rent AS potential_loss
       FROM tenants t
       JOIN units u ON u.id = t.unit_id
       JOIN leases l ON l.unit_id = t.unit_id AND l.status='active'
       WHERE t.status='active' ${filter}
       ORDER BY days_remaining`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// ── Equipment Health (Predictive Maintenance) ─────────────────────────────────

// GET /api/ai/equipment?communityId=
router.get('/equipment', requireAuth, async (req, res, next) => {
  const { communityId } = req.query;
  try {
    const params = [];
    const filter = communityId ? (params.push(communityId), 'WHERE e.community_id=$1') : '';
    const result = await query(
      `SELECT e.id, e.name, b.name AS building, e.equipment_type AS type,
              e.age_years AS age, e.condition_pct AS condition,
              e.last_service_date AS last_service, e.next_service_date AS next_service,
              e.failure_probability, e.estimated_fail_date, e.replacement_cost,
              e.preventive_cost, e.status
       FROM equipment e
       LEFT JOIN buildings b ON b.id = e.building_id
       ${filter}
       ORDER BY e.failure_probability DESC`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// ── Dynamic Pricing ───────────────────────────────────────────────────────────

// GET /api/ai/pricing?communityId=
// Returns units with current rent, market rent, and a simple AI-suggested rent
router.get('/pricing', requireAuth, async (req, res, next) => {
  const { communityId } = req.query;
  try {
    const params = [];
    const filter = communityId ? (params.push(communityId), 'WHERE u.community_id=$1') : '';
    const result = await query(
      `SELECT u.id, u.unit_number AS unit, b.name AS building, u.unit_type AS type,
              u.rent::numeric AS current_rent,
              u.market_rent::numeric AS market_rent,
              -- AI suggestion: target 98% of market rent, capped at 5% above current
              LEAST(u.market_rent * 0.98, u.rent * 1.05)::numeric(10,2) AS suggested_rent,
              u.status
       FROM units u
       LEFT JOIN buildings b ON b.id = u.building_id
       ${filter}
       ORDER BY (u.market_rent - u.rent) DESC`,
      params
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// ── Chatbot  ──────────────────────────────────────────────────────────────────
// POST /api/ai/chat  — stub that returns a canned response in absence of an LLM key
router.post(
  '/chat',
  requireAuth,
  body('message').trim().notEmpty(),
  body('communityId').optional().isInt(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { message } = req.body;
    try {
      // When OPENAI_API_KEY is available, replace this stub with a real LLM call.
      const lowerMsg = message.toLowerCase();
      let reply;
      if (lowerMsg.includes('vacant') || lowerMsg.includes('available'))
        reply = 'Let me check available units for you. Currently there are 2 vacant units: Unit 102 (2BR/2BA, $1,950/mo) and Unit 302 (2BR/2BA, $2,000/mo). Would you like to schedule a tour?';
      else if (lowerMsg.includes('maintenance'))
        reply = 'I see there are 3 open maintenance tickets, 2 of which are marked urgent. Would you like me to escalate the highest-priority ones?';
      else if (lowerMsg.includes('revenue') || lowerMsg.includes('income'))
        reply = 'March revenue was $284,750 — up 5.1% from last month. Collection rate is 94%. Three units are currently under-priced vs. market by $50–$120/mo.';
      else
        reply = `I received your message: "${message}". Connect an OpenAI API key (OPENAI_API_KEY env var) to enable full AI responses powered by GPT-4o with RAG over your property data.`;

      res.json({ reply, timestamp: new Date().toISOString() });
    } catch (err) { next(err); }
  }
);

export default router;
