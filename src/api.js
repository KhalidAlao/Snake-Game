const API_BASE_URL = 'http://localhost:8080/api/leaderboard';

export async function fetchLeaderboard() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json();
}

export async function submitScore(name, score) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, score }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit score: ${response.status} - ${errorText}`);
  }
  // return server's response if you want to inspect it
  return response.text();
}
