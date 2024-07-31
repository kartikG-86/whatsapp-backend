const messageModel = require('../../models/message')
const groupModel = require('../../models/group')
const mongoose = require('mongoose')
const getChatUserList = async (req, res) => {
    const userId = req.params.userId
    console.log(userId)

    const userListAggregation = [
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
                '_id': {
                    '$cond': [
                        {
                            '$eq': [
                                '$fromUserId', new mongoose.Types.ObjectId(userId)
                            ]
                        }, '$toUserId', '$fromUserId'
                    ]
                },
                'lastMessage': {
                    '$first': '$$ROOT'
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
                'time': {
                    '$dateToString': {
                        'format': '%H:%M',
                        'date': '$lastMessage.createdAt',
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

    const groupListAggregation = [
        {
            '$match': {
                $or: [{
                    adminUserId: new mongoose.Types.ObjectId(userId)
                }, {
                    memberUserIds: new mongoose.Types.ObjectId(userId)
                }]
            },
        }, {
            '$addFields': {
                'userName': '$name',
                'time': {
                    '$dateToString': {
                        'format': '%H:%M',
                        'date': '$createdAt',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        }, {
            '$group': {
                '_id': '$_id',
                'user': {
                    '$push': '$$ROOT'
                },
                'time': {
                    '$first': '$time'
                }
            }
        }, {
            '$unwind': {
                'path': '$user',
                'preserveNullAndEmptyArrays': false
            }
        }
    ]

    try {
        const userList = await messageModel.aggregate(userListAggregation)
        const groupList = await groupModel.aggregate(groupListAggregation)
        let newList = [...userList, ...groupList]

        if (newList && newList.length > 0) {
            return res.json({
                success: true,
                message: "Here are your user and group list ",
                userList: newList,

            })
        }
        else {
            return res.json({
                success: true,
                message: "No user and group available",
                userList: newList
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