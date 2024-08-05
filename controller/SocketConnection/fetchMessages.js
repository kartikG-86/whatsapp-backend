const messageModel = require('../../models/message')
const mongoose = require('mongoose')
const getMessages = async (req, res) => {

    const fromUserId = req.params.fromUserId
    const toUserId = req.params.toUserId

    const aggregation = [
        {
            '$match': {
                '$or': [
                    {
                        'fromUserId': new mongoose.Types.ObjectId(fromUserId),
                        'toUserId': new mongoose.Types.ObjectId(toUserId)
                    }, {
                        'fromUserId': new mongoose.Types.ObjectId(toUserId),
                        'toUserId': new mongoose.Types.ObjectId(fromUserId)
                    }
                ]
            }
        }, {
            '$sort': {
                'createdAt': 1
            }
        }, {
            '$addFields': {
              'time': {
                '$dateToString': {
                  'format': '%H:%M', 
                  'date': '$createdAt', 
                  'timezone': 'Asia/Kolkata'
                }
              }, 
              'date': {
                '$dateToString': {
                  'format': '%d/%m/%Y', 
                  'date': '$createdAt'
                }
              }
            }
          }, {
            '$group': {
              '_id': '$date', 
              'messages': {
                '$push': '$$ROOT'
              }
            }
          }
    ]

    try {
        const previousMessages = await messageModel.aggregate(aggregation)

        if (previousMessages && previousMessages.length > 0) {
            return res.json({
                success: true,
                message: "Here are your previous messages",
                previousMessages: previousMessages
            })
        }
        else {
            return res.json({
                success: true,
                message: "No messages available",
                previousMessages: []
            })
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Error generated while fetching messages"
        })
    }

}

module.exports = getMessages