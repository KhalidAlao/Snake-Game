export function showModal(type, data = {}) {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";

    switch(type) {
        case "paused":
            modal.innerHTML = "<h1>Game Paused</h1>";
            break;
        case "gameOver":
            modal.innerHTML = `<h1>Game Over</h1><p>Score: ${data.score}</p>`;
            break;
        case "settings":
            modal.innerHTML = "<h1>Settings</h1><p>Adjust your options here</p>";
            break;
        case "leaderboard":
            modal.innerHTML = `<h1>Leaderboard</h1>${data.entries.map(e => `<p>${e.name}: ${e.score}</p>`).join('')}`;
            break;
    }
}

export function hideModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}