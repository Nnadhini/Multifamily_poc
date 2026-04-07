import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import config from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAuth } from './middleware/auth.js';

import authRouter          from './routes/auth.js';
import communitiesRouter   from './routes/communities.js';
import unitsRouter         from './routes/units.js';
import tenantsRouter       from './routes/tenants.js';
import leasesRouter        from './routes/leases.js';
import financialsRouter    from './routes/financials.js';
import maintenanceRouter   from './routes/maintenance.js';
import bookingsRouter      from './routes/bookings.js';
import communicationsRouter from './routes/communications.js';
import aiRouter            from './routes/ai.js';

const app = express();

// ── Security & parsing ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',           authRouter);
app.use('/api/communities',    communitiesRouter);
app.use('/api/units',          unitsRouter);
app.use('/api/tenants',        tenantsRouter);
app.use('/api/leases',         leasesRouter);
app.use('/api/financials',     financialsRouter);
app.use('/api/maintenance',    maintenanceRouter);
app.use('/api/bookings',       bookingsRouter);
app.use('/api/communications', communicationsRouter);
app.use('/api/ai',             aiRouter);

// ── Server-Sent Events — real-time dashboard stream ──────────────────────────
// Clients: GET /api/events  (EventSource on the frontend)
const sseClients = new Set();

app.get('/api/events', requireAuth, (req, res) => {
  res.set({
    'Content-Type':  'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection':    'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  const client = res;
  sseClients.add(client);

  // Send a heartbeat every 30 s to keep the connection alive through proxies
  const heartbeat = setInterval(() => {
    client.write(':heartbeat\n\n');
  }, 30_000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(client);
  });
});

/**
 * Broadcast a JSON event to all connected SSE clients.
 * @param {string} event  Event name (e.g. 'kpi-update', 'new-ticket')
 * @param {object} data   Payload
 */
export function broadcastEvent(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

// ── Error handler (must be last) ──────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`Rently API running on http://localhost:${config.port} [${config.nodeEnv}]`);
});

export default app;
