const mongoose = require('mongoose')
const { Schema } = mongoose

const MessageSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Message = mongoose.model('messages', MessageSchema)

module.exports = Message