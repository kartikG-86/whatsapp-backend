const mongoose = require('mongoose')
const {Schema} = mongoose;

const GroupMessageSchema = new Schema({
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    senderDetails:{
        type:{},
        required:true
    },  
},{
    timestamps: true 
})
const GroupMessage = mongoose.model('groupMessages',GroupMessageSchema)
module.exports = GroupMessage