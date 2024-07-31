const userModel = require("../../models/user")
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const getAuthToken = async (user) => {
    const data = {
        user: {
            id: user._id,
        },
    };
    const authToken = jwt.sign(data, secretKey);
    return authToken;
};
const login = async (req, res) => {
    const { email, password } = req.body;


    try {
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.json({
                message: "User doesn't exist",
                status: 400,
                success: false,
            });
        }
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.json({
                message: "Invalid User Credentials",
                success: false,
                status: 400,
            });
        }

        const authToken = await getAuthToken(user);
        const safeUser = { ...user }
        delete safeUser._doc.password
        return res.json({
            token: authToken,
            user: safeUser._doc,
            status: 200,
            success: true,
            message: "Login Successfully",
        });
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }


}

module.exports = login