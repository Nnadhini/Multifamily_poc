import 'dotenv/config';

const secret = process.env.JWT_SECRET || 'change-me-in-production';
if (process.env.NODE_ENV === 'production' && secret === 'change-me-in-production') {
  throw new Error('JWT_SECRET must be set to a strong random value in production');
}

export default {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://rently:rently@localhost:5432/rently_db',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwt: {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
  sseHeartbeatMs: parseInt(process.env.SSE_HEARTBEAT_MS || '30000', 10),
};
