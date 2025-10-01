
let entries = JSON.parse(localStorage.getItem('leaderboard')) || [];

export function addOrUpdateEntry(name, score) {
    const now = Date.now();

    // Allow same scores from different players, but not duplicate entries
    const existingEntryIndex = entries.findIndex(e => e.name === name && e.score === score);
    
    if (existingEntryIndex !== -1) {
        // Update timestamp if same player has same score
        entries[existingEntryIndex].timestamp = now;
    } else {
        // Add new entry
        entries.push({ name, score, timestamp: now });
    }

    // Sort by score descending, then timestamp ascending (older same scores preferred)
    entries.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);

    // Keep top 5
    entries = entries.slice(0, 5);

    // Persist
    localStorage.setItem('leaderboard', JSON.stringify(entries));
}


export function qualifiesForLeaderboard(score) {
    
    const currentEntries = getEntries();
    return currentEntries.length < 5 || score > currentEntries[currentEntries.length - 1].score;
}

export function checkAndAddHighScore(score) {
    
    if (qualifiesForLeaderboard(score)) {
        const name = prompt(`Congratulations! You got a leaderboard score of ${score}. Enter your name:`);
        if (name && name.trim()) {
            addOrUpdateEntry(name.trim(), score);
            return true;
        }
    }
    return false;
}

export function getFormattedEntries() {
    return entries.map((entry, index) => ({
        rank: index + 1,
        name: entry.name,
        score: entry.score,
        date: new Date(entry.timestamp).toLocaleDateString()
    }));
}

export function isHighScore(score) {
    const entries = getEntries();
    return entries.length < 5 || score > entries[entries.length - 1].score;
}

export function getEntries() {
    return [...entries];
}

export function clearLeaderboard() {
    entries = [];
    localStorage.removeItem('leaderboard');
}

// Makes the clear leaderboard function globally availiable 
window.clearLeaderboard = clearLeaderboard;