let entries = JSON.parse(localStorage.getItem('leaderboard')) || [];
let onChange = null;

function addOrUpdateEntry(name, score) {
  const now = Date.now();
  const existingIndex = entries.findIndex((e) => e.name === name && e.score === score);
  if (existingIndex !== -1) entries[existingIndex].timestamp = now;
  else entries.push({ name, score, timestamp: now });
  entries.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
  entries = entries.slice(0, 5);
  localStorage.setItem('leaderboard', JSON.stringify(entries));
  if (onChange) onChange(entries);
}

function getEntries() {
  return [...entries];
}
function clearLeaderboard() {
  entries = [];
  localStorage.removeItem('leaderboard');
  if (onChange) onChange(entries);
}
function qualifiesForLeaderboard(score) {
  const current = getEntries();
  return current.length < 5 || score > current[current.length - 1].score;
}
function setLeaderboardChangeCallback(cb) {
  onChange = cb;
}

export {
  addOrUpdateEntry,
  getEntries,
  clearLeaderboard,
  qualifiesForLeaderboard,
  setLeaderboardChangeCallback,
  
};
