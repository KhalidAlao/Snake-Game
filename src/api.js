import { API_BASE_URL } from './config.js';
import authService from './auth.js';

const LEADERBOARD_API_URL = `${API_BASE_URL}/leaderboard`;
const CACHE_DURATION = 10000;
let leaderboardCache = null;
let cacheTimestamp = 0;

function getPublicHeaders() {
  return {
    Accept: 'application/json',
  };
}

function getPrivateHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (authService.isAuthenticated()) {
    const token = authService.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function fetchLeaderboard() {
  const now = Date.now();
  if (leaderboardCache && now - cacheTimestamp < CACHE_DURATION) {
    return leaderboardCache;
  }

  const res = await fetch(LEADERBOARD_API_URL, {
    method: 'GET',
    headers: getPublicHeaders(),
  });

  if (!res.ok) {
    return leaderboardCache || [];
  }

  const data = await res.json();
  leaderboardCache = data;
  cacheTimestamp = now;
  return data;
}

export async function submitScore(score) {
  if (!authService.isAuthenticated()) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(LEADERBOARD_API_URL, {
    method: 'POST',
    headers: getPrivateHeaders(),
    body: JSON.stringify({ score }),
  });

  if (res.status === 401 || res.status === 403) {
    authService.logout();
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Submit failed: ${res.status} ${errorText}`);
  }

  // Invalidate cache after submission
  leaderboardCache = null;
  cacheTimestamp = 0;

  return res.json();
}

export function clearCache() {
  leaderboardCache = null;
  cacheTimestamp = 0;
}
