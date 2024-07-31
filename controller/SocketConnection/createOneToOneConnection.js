const mongoose = require('mongoose')
const messagePeople = require('../../models/messagePeople')

const createOneToOneConnection = async (req, res) => {
    const { fromUserId, } = req.body
    const fromUserIdObj = new mongoose.Types.ObjectId(fromUserId);
    const toUserIdObj = new mongoose.Types.ObjectId(toUserId);
    const aggregation = [{
        '$match': {
            'fromUserId': fromUserIdObj,
            'toUserId': toUserIdObj
        }
    }]

    try {
        const isConnection = await socketConnectionModel.aggregate(aggregation)

        if (isConnection.length == 0) {
            const newConnection = await socketConnectionModel.create({
                fromUserId: fromUserId,
                toUserId: toUserId,
                socketId: socketId
            })
            return res.json({
                success: true,
                connectionDetails: newConnection
            })
        }
        else {
            return res.json({
                success: true,
                connectionDetails: isConnection[0]
            })
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Error generated while creating connection"
        })
    }

}

module.exports = createOneToOneConnection

