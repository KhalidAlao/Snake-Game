import { getEntries } from "./leaderboard.js";

const modal = document.getElementById("modal");
const list = document.getElementById("leaderboardList");
const closeBtn = document.getElementById("closeLeaderboard");

export function initLeaderboardUI(){
    if(!modal || !list || !closeBtn) return;
    closeBtn.addEventListener("click", hideLeaderboard);
}

export function renderLeaderboard(){
    const entries = getEntries();
    list.innerHTML = entries.length
        ? entries.map((e, i) => `<li>${i+1}. ${e.name}: ${e.score}</li>`).join("")
        : "<li>No scores yet!</li>";
}

export function showLeaderboard(){
    modal.classList.remove("hidden");
    renderLeaderboard();
}

export function hideLeaderboard(){
    modal.classList.add("hidden");
}
