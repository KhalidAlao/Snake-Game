function saveScoreToLeaderboard(score) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Add new score and sort
    leaderboard.push(score);
    leaderboard.sort((a, b) => b - a);

    // Keep only top 5
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function renderLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const list = document.getElementById('leaderboardList');
    list.innerHTML = '';

    if (leaderboard.length === 0) {
        const li = document.createElement('li');
        li.textContent = "No scores yet.";
        list.appendChild(li);
        return;
    }

    leaderboard.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent =`${score}`;
        list.appendChild(li);
    });
}
