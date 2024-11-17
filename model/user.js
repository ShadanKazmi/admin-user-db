const {Schema, model, SchemaType} = require('mongoose');
const express = require('express');
const { createHmac, randomBytes } = require("crypto");

const userSchema = new Schema({
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
    createdTasks:[{
        task:{
            type:String,
            required: true,
        },
        admin:{
            type: Schema.Types.ObjectId,
            ref:'admin'
        }
    }]
},
    { timestamps: true }
);


userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
});

const User = model('User', userSchema);


module.exports = User;