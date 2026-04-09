import config from '../config.js';

/**
 * Centralised error handler.  Must be registered as the last middleware.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  // Log full error in development
  if (config.nodeEnv !== 'test') console.error(err);

  const status = err.status || err.statusCode || 500;
  const message =
    config.nodeEnv === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({ error: message });
}
