const groupMessageModel = require('../../models/groupMessage')
const mongoose = require('mongoose')
const getGroupMessages = async (req, res) => {
  const groupId = req.params.groupId;

  const aggregation = [
    {
      '$match': {
        'groupId': new mongoose.Types.ObjectId(groupId)
      }
    }, {
      '$addFields': {
        'date': {
          '$dateToString': {
            'format': '%d/%m/%Y',
            'date': '$createdAt'
          }
        }
      }
    }, {
      '$sort': {
        'createdAt': 1
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
  console.log(groupId)

  try {
    const groupMessages = await groupMessageModel.aggregate(aggregation);
    if (groupMessages) {
      return res.json({
        success: true,
        message: "Here are your messages",
        groupMessages: groupMessages
      })
    }
    else {
      return res.status(400).json({
        success: false,
        message: "Error generated while fetching group Messages"
      })
    }

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Error generated while fetching group Messages"
    })
  }
}

module.exports = getGroupMessages