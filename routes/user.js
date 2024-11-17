const express = require('express');
const {Router} = require('express');
const mongoose = require('mongoose');
const User = require('../model/user');
const Admin = require('../model/admin');


const router = Router();

router.get('/users',async (req,res)=>{
    try {
        const users = await User.find({}, 'firstName lastName email gender createdTasks');
        res.json(users);
    } catch (error) {
        console.error('Error retrieving admins:', error);
        res.status(500).json({ error: 'Server error' });
    }
})


router.get('/admins',async (req,res)=>{
    try {
        const admins = await Admin.find({}, 'firstName lastName email gender assignedTasks');
        res.json(admins);
    } catch (error) {
        console.error('Error retrieving admins:', error);
        res.status(500).json({ error: 'Server error' });
    }
})


router.post('/register',async (req,res)=>{
    const { firstName, lastName, email, gender, password } = req.body;

    try {
        await User.create({ firstName, lastName, email, gender, password });
        res.send("Signed-Up");
    } catch (error) {
        console.error('Error signing up:', error);
        if (error.code === 11000) {
            return res.status(400).send('Email already in use');
        }
        res.status(500).send('Server error');
    }
})


router.post('/login',async (req,res)=>{
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        res.json({
            userId: user._id,
        });
    } catch (error) {
        res.status(500).send("Error logging in");
    }
})

router.post('/upload', async (req, res) => {
    const { userId, adminId, task } = req.body;

    if (!userId || !adminId || !task) {
        return res.status(400).json({ error: "Missing required fields: userId, adminId, or task." });
    }

    try {
        console.log("Fetching user...");
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        console.log("User found:", user);

        console.log("Fetching admin...");
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found." });
        }
        console.log("Admin found:", admin);

        console.log("Adding task to user's created tasks...");
        await User.updateOne(
            { _id: userId },
            {
                $push: {
                    createdTasks: {
                        task,
                        admin: admin._id,
                    },
                },
            }
        );

        console.log("Task added to user's created tasks.");

        console.log("Adding task to admin's assigned tasks...");
        await Admin.updateOne(
            { _id: adminId },
            {
                $push: {
                    assignedTasks: {
                        userId: user._id,
                        task,
                    },
                },
            }
        );
        console.log("Task added to admin's assigned tasks.");

        res.status(200).json({ message: "Task uploaded successfully." });
    } catch (error) {
        console.error("Error occurred while uploading task:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});



module.exports = router;
