const groupModel = require('../../models/group')
const mongoose = require('mongoose')
const fetchCommonGroups = async (req, res) => {
    const user1Id = req.params.user1Id
    const user2Id = req.params.user2Id
    console.log(user1Id, user2Id)
    const aggregation = [
        {
            '$match': {
                'memberUserIds': {
                    '$in': [
                        new mongoose.Types.ObjectId(user1Id),
                        new mongoose.Types.ObjectId(user2Id)
                    ]
                }
            }
        }
    ]

    try {

        const commonGroups = await groupModel.aggregate(aggregation)

        if (commonGroups) {
            return res.json({
                success: true,
                message: "Here are your common Groups",
                commonGroups: commonGroups
            })
        }
        else {
            return res.json({
                success: true,
                message: "Common Groups not exist",
                commonGroups: []
            })
        }

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Error generated while fetching common groups"
        })
    }
}

module.exports = fetchCommonGroups