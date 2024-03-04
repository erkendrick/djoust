import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import * as game from './game/game.js';
import * as constants from './config/constants.js';
const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
export { io };

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

const TICK = setInterval(() => game.gameLoop(io), constants.RATE);


io.on('connection', (socket) => {

    const leftSpawnZone = { xMin: 0, xMax: constants.canvas.width / 3 };
    const rightSpawnZone = { xMin: constants.canvas.width * 2 / 3, xMax: constants.canvas.width };
    const playerWidth = 30;
    const spawnZone = Math.random() < 0.5 ? leftSpawnZone : rightSpawnZone;
    const spawnX = Math.random() * (spawnZone.xMax - spawnZone.xMin - playerWidth) + spawnZone.xMin;

    game.players[socket.id] = {
        id: socket.id,
        spawnPosition: { x: spawnX, y: constants.canvas.height / 2 - 50 },
        position: { x: spawnX, y: constants.canvas.height / 2 - 50 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        height: 40,
        width: 30,
        direction: null,
        orientation: 'right',
        lungeDuration: 300,
        lungeStartTime: null,
        lungeCooldown: 1000,
        lungeLastTime: Date.now() - 5000,
        weapon: {
            width: 20,
            height: 10,
            color: 'grey',
            offsetY: 10,
        },
        deaths: 0
    };
    
    socket.on('duel', (data) => {
        if (data.duel === true) {
            game.duelQueue.push(socket);

            if (game.duelQueue.length >= 2) {
                const player1Socket = game.duelQueue.shift();
                const player2Socket = game.duelQueue.shift();

                const duelRoom = `duel-${player1Socket.id}-${player2Socket.id}`;
                player1Socket.join(duelRoom);
                player2Socket.join(duelRoom);
                game.playerDuelRoomMapping[player1Socket.id] = duelRoom;
                game.playerDuelRoomMapping[player2Socket.id] = duelRoom;
                game.resetAndSpawnPlayers(player1Socket, player2Socket, duelRoom, io);
            }
        }
    })

    socket.on('playerLunge', () => {
        const player = game.players[socket.id];
        if (!player) return;
        const now = Date.now();

        if (now - player.lungeLastTime >= player.lungeCooldown) {
            const LUNGE_FORCE = 5;
            player.acceleration.x += player.orientation === 'left' ? -LUNGE_FORCE : LUNGE_FORCE;

            player.lungeStartTime = now;
            player.lungeLastTime = now;
        }
    });

    socket.on('playerJump', (data) => {

        const player = game.players[socket.id];
        if (data.jumping && player) {
            player.velocity.y = -10;
        }
    });

    socket.on('playerMove', (data) => {
        const player = game.players[socket.id];
        if (!player) return;

        player.direction = data.direction;

        if (data.direction === 'left' || data.direction === 'right') {
            player.orientation = data.direction;
        }

        const MOVE_ACCELERATION = 1;
        switch (player.direction) {
            case 'left':
                player.acceleration.x = -MOVE_ACCELERATION;
                break;
            case 'right':
                player.acceleration.x = MOVE_ACCELERATION;
                break;
            case 'stop':
                player.acceleration.x = 0;
                break;
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        delete game.players[socket.id];
    });
});

