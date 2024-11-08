

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const platforms = [
    { x: 0, y: 0, width: canvas.width, height: 5 },
    { x: 0, y: canvas.height - 5, width: canvas.width / 3, height: 5 },
    { x: canvas.width * 2 / 3, y: canvas.height - 5, width: canvas.width / 3, height: 5 },
    { x: 0, y: canvas.height / 2, width: canvas.width / 3, height: 25 },
    { x: canvas.width * 2 / 3, y: canvas.height / 2, width: canvas.width / 3, height: 25 }
];

function updateLivesDisplay(currentPlayerLives, opponentPlayerLives) {
    const playerLivesCount = document.getElementById('player-lives-count');
    const opponentLivesCount = document.getElementById('opponent-lives-count');

    playerLivesCount.textContent = currentPlayerLives;
    opponentLivesCount.textContent = opponentPlayerLives;
}

function drawPlatforms(ctx) {
    ctx.fillStyle = 'yellow';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function dimCanvas(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCountdown(ctx) {
    ctx.font = '48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(currentMessage, canvas.width / 2, (canvas.height / 2) - 25);
}

export {
    canvas,
    platforms,
    updateLivesDisplay,
    drawPlatforms,
    drawCountdown,
    dimCanvas
}