// leaderboard.js
let entries = JSON.parse(localStorage.getItem('leaderboard')) || [];

export function addOrUpdateEntry(name, score) {
    // Check if this score is already on the leaderboard for this player
    const existing = entries.find(e => e.name === name);
    if (existing) {
        if (score > existing.score) existing.score = score; // only update if higher
    } else {
        entries.push({ name, score });
    }

    // Sort descending by score
    entries.sort((a,b) => b.score - a.score);

    // Keep top 5
    entries = entries.slice(0, 5);

    // Persist
    localStorage.setItem('leaderboard', JSON.stringify(entries));
}

export function getEntries() {
    return entries;
}

export function clearLeaderboard() {
    entries = [];
    localStorage.removeItem('leaderboard');
}
