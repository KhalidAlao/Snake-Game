import config from './config.js';
import authService from './auth.js';

const LEADERBOARD_API_URL = `${config.API_BASE_URL}/leaderboard`;
const CACHE_DURATION = 10000;
let leaderboardCache = null;
let cacheTimestamp = 0;

/**
 * Build headers for any request: always includes JWT if logged in
 */
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    ...authService.getAuthHeader(), // Adds Authorization: Bearer <token> if present
  };
}

/**
 * GET leaderboard with JWT in Authorization header.
 * Uses cache for 30s to reduce requests.
 */
export async function fetchLeaderboard() {
  const now = Date.now();
  if (leaderboardCache && now - cacheTimestamp < CACHE_DURATION) return leaderboardCache;

  try {
    const res = await fetch(LEADERBOARD_API_URL, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors', // CORS enabled on backend
      credentials: 'include', // Optional if using cookies (not JWT in header)
    });

    if (!res.ok) throw new Error(`Failed to fetch leaderboard: ${res.status}`);
    const data = await res.json();

    leaderboardCache = data;
    cacheTimestamp = now;
    return data;
  } catch (err) {
    return leaderboardCache || [];
  }
}

/**
 * POST score to backend, always includes JWT
 */
export async function submitScore(score) {
  if (!authService.isAuthenticated()) {
    throw new Error('Not authenticated');
  }

  try {
    const res = await fetch(LEADERBOARD_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ score }),
      mode: 'cors',
      credentials: 'include',
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Submit failed: ${res.status} ${txt}`);
    }

    // Invalidate cache after submission
    leaderboardCache = null;
    cacheTimestamp = 0;

    try {
      return await res.json();
    } catch {
      return null;
    }
  } catch (err) {
    throw err;
  }
}

/**
 * Clear cached leaderboard
 */
export function clearCache() {
  leaderboardCache = null;
  cacheTimestamp = 0;
}
