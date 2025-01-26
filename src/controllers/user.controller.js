import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import createToken from "../services/createToken.js";

// @desc getAddUserForm



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
        throw new Error(error.message);
    }
});


const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({
            status: true,
            data: users
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id);
        const allUsers = await User.find({});
        if(allUsers.length === 1){
            res.status(400);
            throw new Error('Cannot delete the only user');
        }
        if (!user) {
            res.status(404);
            throw new Error('user not found');
        }
  
        await User.findByIdAndDelete(req.params.id);
  
        res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500);
        console.log(error);
        throw new Error(error.message);
    }
});


// get aa user by id
const getUserById = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        return res.status(200).json({
            status: true,
            data: user
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const updateUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        user.username = req.body.username || user.username;
        user.password = req.body.password || user.password;
        await user.save();
        return res.status(200).json({
            status: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

export { addUser, getAllUsers,deleteUser, getUserById, updateUser};