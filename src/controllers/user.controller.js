import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import createToken from "../services/createToken.js";


// @desc getAddUserForm
const getAddUserForm = (req, res) => {
    res.render('pages/addUser');
};


// @desc add user
const addUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        res.status(400);
        throw new Error("Please provide username and password");
    }
    try {
        const alreadyExist = await User.findOne({ username });
        if(alreadyExist){
            res.status(400);
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        return res.status(201).json({
                message: "User created successfully",
                user: {
                    id: user._id,
                    username: user.username,
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500);
        throw new Error("Server error");
    }
    


});


// @desc Login user




export { getAddUserForm, addUser };