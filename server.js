import { Server } from 'socket.io'
import http, { get } from 'http'
import express from 'express'
const app = express()
const server = http.createServer(app);
const io = new Server(server);

function getRoomClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=> {
        return {
            socketId,
            username: userSocketMap[socketId]
        };
    });
}
const userSocketMap = {};


io.on('connection', (socket) => {
    socket.on('join', ({roomId, username}) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getRoomClients(roomId);
        clients.forEach(({socketId}) => {
            io.to(socketId).emit('joined', {
                clients, username, socketId: socket.id,
            })
        })
    })
})



const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`listening on port ${PORT}`))