import config from './config.js';

const API_BASE_URL = `${config.API_BASE_URL}/leaderboard`;

// Simple cache implementation
let leaderboardCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function fetchLeaderboard() {
  const now = Date.now();
  
  // Return cached data if still valid
  if (leaderboardCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return leaderboardCache;
  }

  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    
    const data = await response.json();
    
    // Update cache
    leaderboardCache = data;
    cacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    // Return cached data even if stale as fallback
    return leaderboardCache || [];
  }
}

export async function submitScore(name, score) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to submit score: ${response.status} - ${errorText}`);
    }
    
    // Invalidate cache on successful submission
    leaderboardCache = null;
    
    return response.text();
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
}

// Clear cache (useful for testing)
export function clearCache() {
  leaderboardCache = null;
  cacheTimestamp = 0;
}