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

        const newMessage = await messageModel.create({
            fromUserId: msgObj.fromUserId,
            toUserId: msgObj.toUserId,
            message: msgObj.message,
            createdAt: new Date()
        })
        console.log(newMessage)

    });

    socket.on('group-message-receive', async (msgObj) => {
        socket.join(msgObj.groupId)
        io.to(msgObj.groupId).emit('group-message', msgObj)
    })

    socket.on('create-group', async (msgObj) => {
        socket.join(msgObj.groupId)
        console.log('group created')

        msgObj.userIds.map((userId) => {
            io.to(userId).emit('join-group-message', msgObj)
        })
    })

    socket.on('join-group', async (msgObj) => {
        console.log(msgObj)
        console.log('join-group', msgObj.groupId)
        socket.join(msgObj.groupId)
    })

    socket.on('get-updated-list', async (user) => {
        console.log("Your Id is ", user.id);

        try {
            const response = await axios.get(`http://localhost:8000/api/connection/userList/${user.id}`);
            const userList = response.data; // Assuming response.data contains the user list
            io.to(user.id).emit('your-updated-list', userList);
        } catch (err) {
            console.error('Error fetching user list:', err);
        }
    });

});

eventEmitter.on('update-status', (userId, message) => {
    io.emit('receive-message', { msg: message, userId: userId });
});

module.exports = {
    socketsMap,
    eventEmitter,
    io
};