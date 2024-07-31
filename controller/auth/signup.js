const userModel = require("../../models/user")
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = process.env.SECRET_KEY;


const getAuthToken = async (user) => {
    const data = {
        user: {
            id: user.id,
        },
    };

    const authToken = jwt.sign(data, secretKey);
    return authToken;
};


const signUp = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const findUser = await userModel.findOne({ email: email })

        if (findUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist with the email"
            })
        } else {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password, salt);
            const createUser = await userModel.create({
                email: email,
                userName: userName,
                password: secPass
            });

            console.log(createUser)

            const authToken = await getAuthToken(createUser)
            const safeUser = { ...createUser }
            delete safeUser._doc.password
            return res.json({
                token: authToken,
                user: safeUser._doc,
                status: 200,
                success: true,
                message: "User created Successfully",
            });
        }

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Error while fetching details"
        })
    }
}

module.exports = signUp