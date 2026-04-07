import pg from 'pg';
import config from '../config.js';

const { Pool } = pg;

const pool = new Pool({ connectionString: config.databaseUrl });

pool.on('error', (err) => {
  console.error('Unexpected database pool error', err);
});

/**
 * Execute a parameterised query.
 * @param {string} text  SQL query text
 * @param {Array}  params  Query parameters
 */
export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  if (config.nodeEnv === 'development') {
    console.debug(`query: ${text} — ${Date.now() - start}ms`);
  }
  return res;
}

/** Acquire a client from the pool for multi-statement transactions. */
export async function getClient() {
  const client = await pool.connect();
  const origQuery = client.query.bind(client);
  // Warn on long-held clients
  const timeout = setTimeout(() => {
    console.warn('A database client has been checked out for more than 5 seconds!');
  }, 5000);
  client.query = async (...args) => {
    client.lastQuery = args;
    return origQuery(...args);
  };
  const origRelease = client.release.bind(client);
  client.release = () => {
    clearTimeout(timeout);
    client.query = origQuery;
    client.release = origRelease;
    return origRelease();
  };
  return client;
}

export default pool;
