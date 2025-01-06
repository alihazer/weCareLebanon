import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import createToken from "../services/createToken.js";

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        res.status(400);
        throw new Error("Please provide username and password");
    }
    const user = await User.findOne({ username });
    if(!user){
        res.status(404);
        throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        res.status(401);
        throw new Error("Invalid credentials");
    }
    const token = createToken(user._id);
    res.status(200).json({
        messasge: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
        },
        token
    })
});

// @desc get login form
const getLoginForm = (req, res) => {
    res.render('pages/login');
};

export { login, getLoginForm };