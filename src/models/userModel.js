const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    cover: {
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)