import { Server } from "socket.io";
import { createServer } from "http";
import Client from "socket.io-client";

describe('Game Integration Tests', () => {
    let io, server, httpServer, clientSocket1, clientSocket2, PORT;

    beforeAll((done) => {
        httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            PORT = httpServer.address().port;
            console.log(`Test server listening on port ${PORT}`)
            io.on('connection', (socket) => {
                console.log(`socket connected `);
                socket.on('duel', () => {
                    // Simplified duel handling logic for testing
                    const duelRoom = "testDuelRoom";
                    socket.join(duelRoom);
                    io.to(duelRoom).emit('duelStart', { countdownDuration: 3 });
                });
            });
            done();
        });
    });

    beforeEach((done) => {
        clientSocket1 = new Client(`http://localhost:${PORT}`);
        clientSocket1.on('connect', done);
    });

    afterEach(() => {
        if (clientSocket1.connected) {
            clientSocket1.disconnect();
        }
        if (clientSocket2 && clientSocket2.connected) {
            clientSocket2.disconnect();
        }
    });

    afterAll(() => {
        io.close();
        httpServer.close();
    });
    
    test('Players can connect', (done) => {
        const testClientSocket = new Client(`http://localhost:${PORT}`);
        testClientSocket.on('connect', () => {
            console.log("Client successfully connected");
            testClientSocket.close();
            done();
        });
    }, 10000);

    test('Two players entering duel queue starts a duel', (done) => {
        clientSocket2 = new Client(`http://localhost:${PORT}`);
        clientSocket2.on('connect', () => {
            clientSocket1.emit('duel');
            clientSocket2.emit('duel');
        });

        let duelStarts = 0;
        const checkDuelStart = () => {
            duelStarts++;
            if (duelStarts === 2) {
                done();
            }
        };

        clientSocket1.on('duelStart', checkDuelStart);
        clientSocket2.on('duelStart', checkDuelStart);
    });
});
