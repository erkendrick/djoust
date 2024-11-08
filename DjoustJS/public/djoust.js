import Player from './Player.js';
import { playerPlatformCollision, getWeaponBoundingBox, isColliding } from './utils/collisionUtils.js';

const socket = io();
const GRAVITY = 0.5;
let bot = null;
let isCountdownActive = false;
let countdownTime = null;
let currentMessage = "PREPARE TO DUEL";
let allowMovement = true;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const platforms = [
    { x: 0, y: 0, width: canvas.width, height: 5 },
    { x: 0, y: canvas.height - 5, width: canvas.width / 3, height: 5 },
    { x: canvas.width * 2 / 3, y: canvas.height - 5, width: canvas.width / 3, height: 5 },
    { x: 0, y: canvas.height / 2, width: canvas.width / 3, height: 25 },
    { x: canvas.width * 2 / 3, y: canvas.height / 2, width: canvas.width / 3, height: 25 }
];

const players = {};
let duel = false;
const duelButton = document.getElementById('duel');
duelButton.addEventListener('click', function () {
    if (duel === false) {
        socket.emit('duel', { duel: true });
        duel = true;
    }

});

bot = new Player({
    position: getRandomSpawnPosition(),
    color: 'red',
    direction: null,
    orientation: 'right'
});

socket.on('stateUpdate', (data) => {
    const playerId = socket.id;
    let inDuel = false;

    const handlePlayerUpdate = (id, playerData, color) => {
        if (!players[id]) {
            players[id] = new Player({ ...playerData, color });
        } else {
            players[id].update({ ...playerData, color });
        }
    };

    if (data.player) {
        handlePlayerUpdate(playerId, data.player, 'blue');
    }

    if (data.players && data.players.length > 1) {
        inDuel = true;
        data.players.forEach(playerData => {
            const color = playerData.id === playerId ? 'blue' : 'red';
            handlePlayerUpdate(playerData.id, playerData, color);
        });
    }

    if (inDuel) {
        const totalLives = 3;
        let currentPlayerLives = totalLives;
        let opponentPlayerLives = totalLives;

        for (const player of data.players) {
            if (player.id === playerId) {
                currentPlayerLives = totalLives - player.deaths;
            } else {
                opponentPlayerLives = totalLives - player.deaths;
            }
        }
        updateLivesDisplay(currentPlayerLives, opponentPlayerLives);
    }
});

function updateLivesDisplay(currentPlayerLives, opponentPlayerLives) {
    const playerLivesCount = document.getElementById('player-lives-count');
    const opponentLivesCount = document.getElementById('opponent-lives-count');

    playerLivesCount.textContent = currentPlayerLives;
    opponentLivesCount.textContent = opponentPlayerLives;
}

socket.on('duelStart', (data) => {
    bot = null;
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
    currentMessage = "PREPARE TO DUEL";
    Object.keys(players).forEach((id) => {
        if (id !== socket.id) {
            delete players[id];
        }
    });
    updateLivesDisplay(0, 0);

    if (!bot) {
        bot = new Player({
            position: getRandomSpawnPosition(),
            color: 'red',
            direction: null,
            orientation: 'right'
        });
    }
});

function checkBotCollision() {
    const playerWeaponHitbox = getWeaponBoundingBox(players[socket.id]);
    const botHitbox = {
        x: bot.position.x,
        y: bot.position.y,
        width: bot.width,
        height: bot.height,
    };

    return isColliding(playerWeaponHitbox, botHitbox);
}

function checkBotWeaponPlayerCollision() {
    const player = players[socket.id];
    if (!player || !bot) {
        return false;
    }

    const botWeaponHitbox = getWeaponBoundingBox(bot);
    const playerHitbox = {
        x: player.position.x,
        y: player.position.y,
        width: player.width,
        height: player.height,
    };

    return isColliding(botWeaponHitbox, playerHitbox);
}

function getRandomSpawnPosition() {
    const isLeftZone = Math.random() < 0.5; 
    const xRangeThird = canvas.width / 3;
    const spawnX = isLeftZone
        ? Math.random() * xRangeThird 
        : Math.random() * xRangeThird + 2 * xRangeThird;

    return { x: spawnX, y: canvas.height / 2 - 250 };
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

function updateBotPositionAndVelocity(bot, timestamp) {
    if (!lastJumpTime || timestamp - lastJumpTime > 2000) {
        bot.velocity.y = -10;
        lastJumpTime = timestamp;
    }

    bot.velocity.y += GRAVITY;
    bot.position.x += bot.velocity.x;
    bot.position.y += bot.velocity.y;
}

function checkAndHandleCollisions(bot, player, timestamp) {
    playerPlatformCollision(bot, platforms);
    if (player && checkBotCollision()) {
        respawnBot(bot);
        incrementBotKills();
    }
    if (checkBotWeaponPlayerCollision() && canUpdatePlayerDeaths) {
        handlePlayerDeath();
        socket.emit('playerHitByBotWeapon', { playerId: socket.id });
    }
    if (player && player.position.y > canvas.height - 15 && canUpdatePlayerDeaths) {
        handlePlayerDeath();
    }
}

function incrementBotKills() {
    const botKills = document.getElementById('player-lives-count');
    const currentKills = parseInt(botKills.textContent, 10);
    botKills.textContent = currentKills + 1;
}

function handlePlayerDeath() {
    canUpdatePlayerDeaths = false;
    setTimeout(() => { canUpdatePlayerDeaths = true; }, 250);

    const playerDeaths = document.getElementById('opponent-lives-count');
    playerDeaths.textContent = parseInt(playerDeaths.textContent, 10) + 1;
}

function respawnBot(bot) {
    const newSpawnPosition = getRandomSpawnPosition();
    bot.position.x = newSpawnPosition.x;
    bot.position.y = newSpawnPosition.y;
}

let lastJumpTime = 0;
let canUpdatePlayerDeaths = true;
let lastFrameTime = 0;
const targetFrameTime = 1000 / 64;

function renderLoop(timestamp) {
    requestAnimationFrame(renderLoop);

    if (!lastFrameTime || timestamp - lastFrameTime >= targetFrameTime) {
        lastFrameTime = timestamp - ((timestamp - lastFrameTime) % targetFrameTime);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const player = players[socket.id];
        Object.values(players).forEach(p => p.draw(ctx));

        if (bot) {
            updateBotPositionAndVelocity(bot, timestamp);
            checkAndHandleCollisions(bot, player, timestamp);
            bot.draw(ctx);
        }

        drawPlatforms(ctx);

        if (isCountdownActive) {
            dimCanvas(ctx);
            drawCountdown(ctx);
        }
    }
}

const keyState = {
    KeyA: false,
    KeyD: false,
    Space: false,
    ShiftLeft: false
};

let lastLungeTime = 0;
const LUNGE_COOLDOWN = 2500;

document.addEventListener('keydown', function (event) {
    if (!allowMovement) return;
    const now = Date.now();

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
                if (now - lastLungeTime >= LUNGE_COOLDOWN) {
                    socket.emit('playerLunge');
                    lastLungeTime = now;
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

renderLoop(0);


/*
    PRIORITY: refactor and separate utils from this file

   client <-> server <-> client
    |
    V
   bots

   client side listens for user inputs and emits movement codes
   client side recieves Player state updates from server at TICK RATE
       server does all computation of physics, collisions, game rooms
       server emits player state update per TICK 

    bots are entirely generated, simulated, and rendered on client side
        the server has no idea the bots exist. 
        the renderLoop has the information of player position so use that to calculate bot/Player collision. 


    Bot tasks:
        give bots chaotic and random movement
            work in more dynamic player chasing logic after establishing that the bots can just move around all crazy
        
    GENERAL TODO:
        there needs to be a grace period when players die. They should be invincible with a visual cue for a couple seconds
        respawn should be random
        

*/