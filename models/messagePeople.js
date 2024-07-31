const mongoose = require('mongoose')
const { Schema } = mongoose

const MessagePeopleSchema = new Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
})

const MessagePeople = mongoose.model('messagePeople', MessagePeopleSchema)

module.exports = MessagePeople