const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    skills: {
        type: [String],
        required: true
    },
    experience: {
        type: String,
        enum: ["fresher", "1yr", "2yr", "3yr"]
    }

}, { timestamps: true })

module.exports = mongoose.model('job', jobSchema)