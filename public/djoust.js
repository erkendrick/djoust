import Player from './Player.js';

let isCountdownActive = false; 
let countdownTime = null; 
let currentMessage = "Prepare to duel";
let allowMovement = true;
const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const players = {};
let duel = false;
const duelButton = document.getElementById('duel');
duelButton.addEventListener('click', function () {
    if (duel === false) {

        socket.emit('duel', { duel: true });
        duel = true;
    }
    console.log('duel is set to ', duel);
});

socket.on('stateUpdate', (data) => {
    const playerId = socket.id;
    if (data.player) {
        const playerData = data.player;
        const color = 'blue';
        if (!players[playerId]) {
            players[playerId] = new Player({ ...playerData, color });
        } else {
            players[playerId].update({ ...playerData, color });
        }
    } else if (data.players && Array.isArray(data.players)) {
        data.players.forEach(playerData => {
            const color = playerData.id === playerId ? 'blue' : 'red';
            if (!players[playerData.id]) {
                players[playerData.id] = new Player({ ...playerData, color });
            } else {
                players[playerData.id].update({ ...playerData, color });
            }
        });
    }
});

socket.on('duelStart', (data) => {
    isCountdownActive = true;
    allowMovement = false;
    countdownTime = data.countdownDuration; 

    const countdownInterval = setInterval(() => {
        countdownTime -= 1;
        if (countdownTime <= 1) { 
            currentMessage = "DJOUST";
        }
        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            isCountdownActive = false;
            allowMovement = true;
        }
    }, 1000);
});

socket.on('duelEnd', () => {
    duel = false;
    currentMessage = "Prepare to duel";
    Object.keys(players).forEach((id) => {
        if (id !== socket.id) {
            delete players[id];
        }
    });
    console.log('duelEnd received. Duel is set to ', duel);
});

const platforms = [
    { x: 0, y: 0, width: canvas.width, height: 5 },
    { x: 0, y: canvas.height - 5, width: canvas.width / 3, height: 5 },
    { x: canvas.width * 2 / 3, y: canvas.height - 5, width: canvas.width / 3, height: 5 },
    { x: 0, y: canvas.height / 2, width: canvas.width / 3, height: 25 },
    { x: canvas.width * 2 / 3, y: canvas.height / 2, width: canvas.width / 3, height: 25 }
];

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
    ctx.fillText(currentMessage, canvas.width / 2, canvas.height / 2);
}

function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.values(players).forEach(player => {
        player.draw(ctx);
    });
    drawPlatforms(ctx);

    if (isCountdownActive) {
        dimCanvas(ctx);
        drawCountdown(ctx);
    }

    requestAnimationFrame(renderLoop);
}

const keyState = {
    KeyA: false,
    KeyD: false,
    Space: false,
    ShiftLeft: false
};

document.addEventListener('keydown', function (event) {
    if (!allowMovement) return;
    if (event.code in keyState && !keyState[event.code]) {
        event.preventDefault();
        keyState[event.code] = true;

        switch (event.code) {
            case 'KeyA':
                socket.emit('playerMove', { direction: 'left' });
                break;
            case 'KeyD':
                socket.emit('playerMove', { direction: 'right' });
                break;
            case 'Space':
                if (keyState[event.code]) {
                    socket.emit('playerJump', { jumping: true });
                }
                break;
            case 'ShiftLeft':
                if (keyState[event.code]) {
                socket.emit('playerLunge', { lunging: true });
                }
                break;
        }
    }
});

document.addEventListener('keyup', function (event) {
    if (!allowMovement) return;
    if (event.code in keyState) {
        event.preventDefault();
        keyState[event.code] = false;

        const direction = keyState.KeyA ? 'left' : keyState.KeyD ? 'right' : 'stop';
        socket.emit('playerMove', { direction });
    }
});

renderLoop();
