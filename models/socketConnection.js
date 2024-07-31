const mongoose = require('mongoose')
const {Schema} = mongoose

const SocketConnectionSchema = new Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    socketId:{
        type:String,
        required:true
    }
})

const SocketConnection = mongoose.model('socketConnection',SocketConnectionSchema)

module.exports = SocketConnection