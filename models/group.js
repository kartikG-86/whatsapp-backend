const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '', 
    },
    imgUrl: {
        type: String,
        default: '',
    },
    adminUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    memberUserIds: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        required: true,
        default: [], 
    },
}, {
    timestamps: true 
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
