const express = require('express');
const {Router} = require('express');
const mongoose = require('mongoose');
const User = require('../model/user');
const Admin = require('../model/admin');

const router = Router();

router.get('/admininfo',async (req,res)=>{
    try {
        const admin = await Admin.find().populate('acceptedTasks.task'); 
        res.json(admin);
    } catch (error) {
        console.error('Error retrieving admins:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

router.post('/assignments/:id/accept', async (req, res) => {
    const { id } = req.params;
    const { taskId } = req.body;

    if (!taskId) {
        return res.status(400).json({ error: "Missing taskId in request body." });
    }

    try {
        const admin = await Admin.findOne({ _id: id, "assignedTasks._id": taskId });

        if (!admin) {
            return res.status(404).json({ error: "Task not found in assignedTasks or Admin not found." });
        }

        const taskToAccept = admin.assignedTasks.find(task => task._id.toString() === taskId);

        if (!taskToAccept) {
            return res.status(404).json({ error: "Task not found." });
        }

        const result = await Admin.updateOne(
            { _id: id },
            {
                $push: {
                    acceptedTasks: {
                        _id: taskToAccept._id,
                        task: taskToAccept.task,
                        userId: taskToAccept.userId 
                    }
                },
                $pull: { assignedTasks: { _id: taskId } } 
            }
        );

        res.status(200).json({ message: "Task accepted successfully.", result });
    } catch (error) {
        console.error('Error saving assignment:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/assignments/:id/reject', async (req, res) => {
    const { id } = req.params; 
    const { taskId } = req.body; 

    if (!taskId) {
        return res.status(400).json({ error: "Missing taskId in request body." });
    }

    try {
        const admin = await Admin.findOne({ _id: id, "assignedTasks._id": taskId });

        if (!admin) {
            return res.status(404).json({ error: "Task not found in assignedTasks or Admin not found." });
        }

        const taskToReject = admin.assignedTasks.find(task => task._id.toString() === taskId);

        if (!taskToReject) {
            return res.status(404).json({ error: "Task not found." });
        }

        const result = await Admin.updateOne(
            { _id: id },
            {
                $pull: { assignedTasks: { _id: taskId } }, 
                $push: {
                    rejectedTasks: {
                        _id: taskToReject._id,
                        task: taskToReject.task,
                        userId: taskToReject.userId 
                    }
                }
            }
        );

        res.status(200).json({ message: "Task rejected successfully.", result });
    } catch (error) {
        console.error('Error rejecting assignment:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/register',async (req,res)=>{
    const { firstName, lastName, email, gender, password } = req.body;

    try {
        await Admin.create({ firstName, lastName, email, gender, password });
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
        const admin = await Admin.findOne({ email });
        res.json({
            adminId: admin._id,
        });
    } catch (error) {
        res.status(500).send("Error logging in");
    }
})

module.exports = router;