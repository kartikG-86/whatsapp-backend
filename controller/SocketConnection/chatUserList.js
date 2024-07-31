const messageModel = require('../../models/message')
const mongoose = require('mongoose')
const getChatUserList = async (req, res) => {
    const userId = req.params.userId


    const aggregation = [
        {
            '$match': {
                '$or': [
                    {
                        'fromUserId': new mongoose.Types.ObjectId(userId)
                    }, {
                        'toUserId': new mongoose.Types.ObjectId(userId)
                    }
                ]
            }
        }, {
            '$sort': {
                'createdAt': -1
            }
        }, {
            '$group': {
                '_id': '$toUserId',
                'lastMessage': {
                    '$first': '$$ROOT'
                }
            }
        }, {
            '$match': {
                '_id': {
                    '$ne': new mongoose.Types.ObjectId(userId)
                }
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': '_id',
                'foreignField': '_id',
                'as': 'user'
            }
        }, {
            '$unwind': {
                'path': '$user',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$addFields': {
                'latestMessage': '$lastMessage.message',
                'time': '$lastMessage.createdAt'
            }
        }, {
            '$addFields': {
                'time': {
                    '$dateToString': {
                        'format': '%H:%M',
                        'date': '$time',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        }, {
            '$project': {
                '_id': 1,
                'user': 1,
                'time': 1,
                'latestMessage': 1
            }
        }
    ]

    try {
        const userList = await messageModel.aggregate(aggregation)
        console.log(userList)
        if (userList && userList.length > 0) {
            return res.json({
                success: true,
                message: "Here are your user list ",
                userList: userList
            })
        }
        else {
            return res.json({
                success: true,
                message: "No user available",
                userList: userList
            })
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Error generated while fetching users"
        })
    }
}

module.exports = getChatUserList