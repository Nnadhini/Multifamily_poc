/**
 * Axios instance pre-configured with:
 * - Base URL from VITE_API_URL env var
 * - Auto-attach JWT from localStorage on every request
 * - 401 → clear token and redirect to /login
 *
 * When VITE_API_URL is not set the app falls back to mock data
 * (see each api/*.js file), so the demo mode still works without a backend.
 */
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || '';

const client = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every outbound request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('rently_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 — token expired or invalid — clear auth and emit an event for the
// AuthContext to handle (avoids bypassing React Router with window.location).
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rently_token');
      localStorage.removeItem('rently_user');
      window.dispatchEvent(new CustomEvent('rently:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default client;
