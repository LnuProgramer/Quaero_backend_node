import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { setupSocketHandlers } from './controllers/socket.controller.js';
import cors from 'cors';
const port = 3030;
const app = express();
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.get('/', (req, res) => {
    res.send('🎥 Video Chat Service is running');
});
setupSocketHandlers(io);
server.listen(port, () => {
    console.log(`🎧 Video Chat service listening on port ${port}`);
});
//# sourceMappingURL=videoServer.js.map