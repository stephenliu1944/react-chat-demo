import uuidv4 from 'uuid/v4';
import fs from 'fs';
import path from 'path';
import http from 'http';
import socket from 'socket.io';
import { SocketEvent } from '../src/constants/enum';

const env = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')));
const PORT = env.webSocket.port;

var server = http.createServer();

var io = socket(server, {
    pingInterval: 10000,
    pingTimeout: 5000
});
var numUsers = 0;

io.on('connection', function(socket) {
    console.log('connect a new socket', socket.id);
    numUsers++;

    // 新用户加入
    io.emit(SocketEvent.USER_JOINED, {
        user: socket.id,
        numUsers: numUsers
    }); 
    // 收到新消息
    socket.on(SocketEvent.NEW_MESSAGE, (msg) => {
        // 发给除自己以为的socket连接
        socket.broadcast.emit(SocketEvent.NEW_MESSAGE, msg);
    });
    // 收到消息状态更新
    socket.on(SocketEvent.UPDATE_MESSAGE, (msg) => {
        // 发给除自己以为的socket连接
        socket.broadcast.emit(SocketEvent.UPDATE_MESSAGE, msg);
    });
    // 断开连接
    socket.on('disconnect', () => {
        --numUsers;
        
        socket.broadcast.emit(SocketEvent.USER_LEFT, {
            user: socket.id,
            numUsers: numUsers
        });
    });

});

server.listen(PORT, function() {
    console.log('listening on: ' + PORT);
});