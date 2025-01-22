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
    const isDevEnv = process.env.NODE_ENV === 'development';

    const options = {
        expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days,
        httpOnly: !isDevEnv,
        secure: !isDevEnv,
        sameSite: isDevEnv ? 'lax' : 'none',
    };
    res.cookie('token', token, options);
    
    return res.status(200).json({
        status: true,
        message: "Login successful",
        // token,
    });
});

const logout = asyncHandler(async (req, res) => {
    try {
        const isDevEnv = process.env.NODE_ENV == 'development'
        res.clearCookie('token', {
            path: '/', 
            secure: !isDevEnv,
            sameSite: isDevEnv ? 'lax' : 'none',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to logout' });
    }
});



// @desc get login form
const getLoginForm = (req, res) => {
    res.render('pages/login');
};



export { login, getLoginForm,logout };