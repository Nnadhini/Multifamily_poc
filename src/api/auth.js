import client from './client.js';

export async function login(email, password) {
  const res = await client.post('/api/auth/login', { email, password });
  return res.data; // { token, user }
}

export async function register(email, password, fullName) {
  const res = await client.post('/api/auth/register', { email, password, fullName });
  return res.data;
}

export async function fetchMe() {
  const res = await client.get('/api/auth/me');
  return res.data;
}
