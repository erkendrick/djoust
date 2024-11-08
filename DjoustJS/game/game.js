import * as collisionUtils from '../public/utils/collisionUtils.js';
import * as constants from '../config/constants.js';
import { io } from '../server.js';

const players = {};
const duelQueue = [];
const playerDuelRoomMapping = {};

function weaponPlayerCollision(player1, player2) {
    checkAndResetOnCollision(player1, player2);
    checkAndResetOnCollision(player2, player1);
}

function checkAndResetOnCollision(attacker, defender) {
    const weaponHitbox = collisionUtils.getWeaponBoundingBox(attacker);
    const defenderHitbox = {
        x: defender.position.x,
        y: defender.position.y,
        width: defender.width,
        height: defender.height,
    };

    if (collisionUtils.isColliding(weaponHitbox, defenderHitbox)) {
        defender.position = {...defender.spawnPosition}; 
        defender.velocity.x = 0; 
        defender.velocity.y = 0; 
        handlePlayerDeath(defender.id, io); 
    }
}

function handlePlayerDeath(playerId) {
    const player = players[playerId];
    if (!player || !playerDuelRoomMapping[playerId]) return;

    player.deaths += 1;
    if (player.deaths >= 3) {
        const duelRoom = playerDuelRoomMapping[playerId];
        endDuel(duelRoom);
    }
}

function endDuel(duelRoom) {
    const playerIds = Object.keys(playerDuelRoomMapping).filter(playerId => playerDuelRoomMapping[playerId] === duelRoom);

    playerIds.forEach(playerId => {
        const playerSocket = io.sockets.sockets.get(playerId);
        
        if (playerSocket) {
            playerSocket.leave(duelRoom);
        }

        io.to(playerId).emit('duelEnd');
        
        if (players[playerId]) {
            players[playerId].deaths = 0; 
        }
        delete playerDuelRoomMapping[playerId];
    });
}

function updatePlayerState(player) {
    collisionUtils.updatePlayerEmbeddedState(player, constants.platforms);
        if (!player.embedded) {
            player.velocity.x += player.acceleration.x;
            player.velocity.y += constants.GRAVITY;
        }
        const DRAG = 0.1;
        player.velocity.x *= (1 - DRAG);

        player.position.x += player.velocity.x;
        player.position.y += player.velocity.y;
}

function playerBoundaryCheck(player) {
    if (player.position.x + player.width < 0) {
        player.position.x = constants.canvas.width;
    } else if (player.position.x > constants.canvas.width) {
        player.position.x = -player.width;
    }

    if (player.position.y > constants.canvas.height) {
        player.position = {...player.spawnPosition};
        player.velocity.x = 0;
        player.velocity.y = 0;
        handlePlayerDeath(player.id);
    }
}

function addToDuelRoom(player, playerDuelRoomMapping, duelRoomStates) {
    const duelRoom = playerDuelRoomMapping[player.id];
    if (duelRoom) {
        if (!duelRoomStates[duelRoom]) {
            duelRoomStates[duelRoom] = [];
        }
        duelRoomStates[duelRoom].push(player);
    }
}

function emitDuelRooms(duelRoomStates, io) {
    Object.keys(duelRoomStates).forEach(duelRoom => {
        const playersInRoom = duelRoomStates[duelRoom];
        for (let i = 0; i < playersInRoom.length; i++) {
            for (let j = i + 1; j < playersInRoom.length; j++) {
                collisionUtils.playerPlayerCollision(playersInRoom[i], playersInRoom[j]);
                collisionUtils.weaponWeaponCollision(playersInRoom[i], playersInRoom[j]);
                weaponPlayerCollision(playersInRoom[i], playersInRoom[j]);
            }
        }
        io.to(duelRoom).emit('stateUpdate', { players: playersInRoom });
    });
}

function emitSoloPlayers(players, playerDuelRoomMapping, io) {
    Object.keys(players).forEach(playerId => {
        const player = players[playerId];
        const duelRoom = playerDuelRoomMapping[playerId];
        if (!duelRoom) {
            io.to(playerId).emit('stateUpdate', { player });
        }
    });
}

function resetAndSpawnPlayers(player1Socket, player2Socket, duelRoom, io) {
    const leftSpawnPosition = { x: constants.canvas.width / 6, y: constants.canvas.height / 2 - 50 };
    const rightSpawnPosition = { x: constants.canvas.width * 5 / 6, y: constants.canvas.height / 2 - 50 };

    const playersToSpawn = [player1Socket, player2Socket];
    const spawnPositions = [leftSpawnPosition, rightSpawnPosition];

    playersToSpawn.forEach((socket, index) => {
        const player = players[socket.id];
        if (player) {
            
            player.spawnPosition = spawnPositions[index];
            player.position = { ...spawnPositions[index] };
            player.velocity = { x: 0, y: 0 };
            player.acceleration = { x: 0, y: 0 };

            io.to(duelRoom).emit('duelStart', { 
                message: 'Prepare for duel!',
                countdownDuration: 5
            });
        }
    });
}

function gameLoop(io) {
    const duelRoomStates = {};

    Object.keys(players).forEach(playerId => {
        const player = players[playerId];
        updatePlayerState(player);

        collisionUtils.playerPlatformCollision(player, constants.platforms);
        collisionUtils.weaponPlatformCollision(player, constants.platforms);

        playerBoundaryCheck(player);
        addToDuelRoom(player, playerDuelRoomMapping, duelRoomStates);
    });

    emitDuelRooms(duelRoomStates, io);
    emitSoloPlayers(players, playerDuelRoomMapping, io); 
}

export {
  players,
  duelQueue,
  playerDuelRoomMapping,
  weaponPlayerCollision,
  checkAndResetOnCollision,
  handlePlayerDeath,
  endDuel,
  updatePlayerState,
  playerBoundaryCheck,
  addToDuelRoom,
  emitDuelRooms,
  emitSoloPlayers,
  resetAndSpawnPlayers,
  gameLoop
};