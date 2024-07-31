const { Server } = require('socket.io');
const EventEmitter = require('events');
const axios = require('axios')
const eventEmitter = new EventEmitter()
const socketsMap = new Map();
const messageModel = require('./models/message')

const io = new Server({
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    compress: true
});

io.on('connection', async (socket) => {
    socket.on('user-joined', async (obj) => {
        socket.username = obj.userId
        socket.join(obj.userId)
        console.log(obj.userId)
    })
    socket.on('message', async (msgObj) => {
        io.to(msgObj.toUserId).emit('receive-message', msgObj)
        // io.to(msgObj.fromUserId).emit('receive-message', msgObj)

        const newMessage = await messageModel.create({
            fromUserId: msgObj.fromUserId,
            toUserId: msgObj.toUserId,
            message: msgObj.message,
            createdAt: new Date()
        })
        console.log(newMessage)

    });

    socket.on('join-group', async ({ adminUserId, userIds, groupId }) => {
        console.log('join-group', groupId)
        socket.join(groupId)
        io.to(groupId).emit('group-message', { message: 'group created' })

    })
});

eventEmitter.on('update-status', (userId, message) => {
    io.emit('receive-message', { msg: message, userId: userId });
});

module.exports = {
    socketsMap,
    eventEmitter,
    io
};