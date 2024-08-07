const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
    imgUrl: {
        type: String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const User = mongoose.model('user', UserSchema);
module.exports = User