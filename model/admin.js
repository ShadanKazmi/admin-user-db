const {Schema, model} = require('mongoose');
const express = require('express');
const { createHmac, randomBytes } = require("crypto");

const adminSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },

    assignedTasks: [{
        userId:{
            type: Schema.Types.ObjectId,
            ref:'User',
        },
        task:{
            type:String,
        }
    }],

    acceptedTasks: [{
        userId:{
            type: Schema.Types.ObjectId,
            ref:'User',
        },
        task:{
            type:String,
        },
    }],
    rejectedTasks: [{
        userId:{
            type: Schema.Types.ObjectId,
            ref:'User',
        },
        task:{
            type:String,
        },
    }]
},
    { timestamps: true }
);


adminSchema.pre('save', function (next) {
    const admin = this;
    if (!admin.isModified('password')) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(admin.password)
        .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
});

const Admin = model('admin', adminSchema);
module.exports = Admin;