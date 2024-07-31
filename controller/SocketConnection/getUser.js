const userModel = require('../../models/user')
const mongoose = require('mongoose')
const getUser = async (req, res) => {
    let userId = req.params.id;
    const user = await userModel.findById(userId)
    if (user) {
        return res.json({
            success: true,
            message: "Here are your user details",
            user: user
        })
    }
    else {
        return res.status(400).json({
            success: false,
            message: "User doesn't exist"
        })
    }
}
module.exports = getUser