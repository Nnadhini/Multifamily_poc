import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/index.js';
import config from '../config.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, orgId: user.org_id },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

// POST /api/auth/register
router.post(
  '/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('fullName').trim().notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, fullName } = req.body;
    try {
      const exists = await query('SELECT id FROM users WHERE email=$1', [email]);
      if (exists.rowCount > 0) return res.status(409).json({ error: 'Email already registered' });

      const hash = await bcrypt.hash(password, 10);
      const result = await query(
        `INSERT INTO users (email, password_hash, full_name, role)
         VALUES ($1, $2, $3, 'manager') RETURNING id, email, full_name, role, org_id`,
        [email, hash, fullName]
      );
      const user = result.rows[0];
      res.status(201).json({ token: signToken(user), user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role } });
    } catch (err) { next(err); }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const result = await query('SELECT * FROM users WHERE email=$1', [email]);
      if (result.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });

      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });

      res.json({
        token: signToken(user),
        user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role },
      });
    } catch (err) { next(err); }
  }
);

// GET /api/auth/me  — returns current user from token
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, email, full_name, role, org_id, created_at FROM users WHERE id=$1',
      [req.user.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    const u = result.rows[0];
    res.json({ id: u.id, email: u.email, fullName: u.full_name, role: u.role });
  } catch (err) { next(err); }
});

export default router;
