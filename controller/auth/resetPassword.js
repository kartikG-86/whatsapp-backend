const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const userModel = require('../../models/user')

const getAuthToken = async (id) => {
    const data = {
        user: {
            id: id,
        },
    };

    const authToken = jwt.sign(data, secretKey);
    return authToken;
};
const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;


    if (newPassword != confirmPassword) {
        return res.send({
            message:
                "The new password and confirmed password do not match. Please ensure both passwords are identical and try again.",
            status: 400,
            success: false,
        });
    }


    var user = await userModel.findOne({ email: email });
    if (!user) {
        return res.send({
            message: "User doesn't exist",
            status: 400,
            success: false,
        });
    }


    const comparePass = await bcrypt.compare(newPassword, user.password);
    if (comparePass) {
        return res.send({
            message:
                "Your new password must be different from your previous password. Please choose a new password.",
            status: 400,
            success: false,
        });
    }

    // Update Password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(newPassword, salt);

    const id = user.id;
    user = await userModel.updateOne(
        { email: email },
        { $set: { password: secPass } }
    );

    const authToken = await getAuthToken(id);
    return res.send({
        token: authToken,
        message: "Password Updated Successfully",
        status: 200,
        success: true,
    });

}

module.exports = resetPassword