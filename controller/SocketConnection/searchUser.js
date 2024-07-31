const userModel = require('../../models/user')

const searchUser = async (req, res) => {
    let userName = req.params.userName
    userName = userName.toLowerCase()
    const aggregation = [
        {
            '$addFields': {
                'userName': {
                    '$toLower': '$userName'
                }
            }
        }, {
            '$match': {
                'userName': new RegExp(userName)
            }
        }
    ]

    const users = await userModel.aggregate(aggregation)

    if (users && users.length > 0) {
        return res.json({
            success: true,
            message: "Here are your users",
            users: users
        })
    }
    else {
        return res.json({
            success: true,
            message: "No user exist with this username",
            users: users
        })
    }
}

module.exports = searchUser