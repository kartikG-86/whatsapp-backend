const groupModel = require('../../models/group')
const mongoose = require('mongoose')
const createGroup = async (req, res) => {
    const { name, userIds, adminUserId } = req.body;

    try {
        if (userIds.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Select At least one user"
            })
        }

        const newGroup = await groupModel.create({
            name: name,
            adminUserId: adminUserId,
            memberUserIds: [...userIds, adminUserId]
        })

        if (newGroup) {
            return res.json({
                success: true,
                message: "Group Created Successfully",
                group: newGroup
            })
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Error while creating a group"
        })
    }
}

module.exports = createGroup