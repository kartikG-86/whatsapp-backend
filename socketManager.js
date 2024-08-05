const { Server } = require('socket.io');
const EventEmitter = require('events');
const axios = require('axios')
const eventEmitter = new EventEmitter()
const socketsMap = new Map();
const messageModel = require('./models/message')
const groupMessageModel = require('./models/groupMessage')
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

        const newMessage = await messageModel.create({
            fromUserId: msgObj.fromUserId,
            toUserId: msgObj.toUserId,
            message: msgObj.message,
            createdAt: new Date(),
            msgId: msgObj.msgId,
        })
        console.log(newMessage)

    });

    socket.on('group-message-receive', async (msgObj) => {
        console.log(msgObj)
        socket.join(msgObj.groupId)
        io.to(msgObj.groupId).emit('group-message', msgObj)
        const newMessage = await groupMessageModel.create(msgObj)
        console.log(newMessage)
    })

    socket.on('create-group', async (msgObj) => {
        socket.join(msgObj.groupId)

        msgObj.userIds.map((userId) => {
            io.to(userId).emit('join-group-message', msgObj)
        })
    })

    // Server-side code using Socket.IO
    socket.on('join-group', async (msgObj) => {
        console.log(msgObj);
        console.log('join-group', msgObj.groupId);

        if (msgObj.groupId) {
            socket.join(msgObj.groupId);
            console.log(`Socket ${socket.id} joined group ${msgObj.groupId}`);
        } else {
            console.error('Group ID is missing');
        }
    });

    socket.on('get-updated-list', async (user) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/connection/userList/${user.id}`);
            const userList = response.data; // Assuming response.data contains the user list
            io.to(user.id).emit('your-updated-list', userList);
        } catch (err) {
            console.error('Error fetching user list:', err);
        }
    });

    socket.on('delete-message', async (msg) => {
        console.log(msg)
        const deletePayload = {
            msgId: msg.msgId,
            deleteType: msg.deleteType
        }
        try {
            const response = await axios.delete(`http://localhost:8000/api/connection/deleteMessage`, { data: deletePayload });
            console.log(response)
            if (response.data.success && msg.deleteType == "everyone") {
                io.to(msg.toUserId).emit('message-delete', msg)
            }
        } catch (err) {
            console.error(err)
        }
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