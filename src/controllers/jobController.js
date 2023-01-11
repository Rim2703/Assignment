const jobModel = require("../models/jobModel")
const userModel = require("../models/userModel")

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const regName = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/

// _____________________create Job api____________________

const createJob = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please enter Job details" });

        let { title, description, email, skills, experience } = data
        if (!isValid(title)) return res.status(400).send({ status: false, message: "title is Required" });

        if (!regName.test(title)) {
            return res.status(400).send({ message: "Please enter valid title" })
        }

        if (!isValid(description)) return res.status(400).send({ status: false, message: "description is Required" });

        if (!regName.test(description)) {
            return res.status(400).send({ message: "Please enter valid description" })
        }

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is Required" });

        const regx = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Enter Valid Email" });

        let emailData = await jobModel.findOne({ email: email })

        //.............when email is already in use............
        if (emailData) return res.status(400).send({ status: false, msg: 'Duplicate email found, Please try with another!!' })

        if (!isValid(skills)) return res.status(400).send({ status: false, message: "skills is Required" });

        if (!["fresher", "1yr", "2yr", "3yr"].includes(experience)) return res.status(400).send({ status: false, message: "Please write correct format for experience" });

        let createJob = await jobModel.create(data)
        res.status(201).send({ status: true, message: "Job Created Successfully", data: createJob })

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

// _____________________filter api for job____________________

const getJobsByFilter = async function (req, res) {
    try {
        let query = req.query
        if (Object.keys(query).length > 0) {
            let post = await jobModel.find(query)
            return post.length === 0 ? res.status(404).send({ status: false, msg: "Job not found" }) : res.status(200).send({ status: true, data: post })
        }
        else {
            let post = await jobModel.find()
            return post.length === 0 ? res.status(404).send({ status: false, msg: "Job not found" }) : res.status(200).send({ status: true, data: post })
        }

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

// _____________________get users data api____________________

const getAllApplications = async function (req, res) {
    try {
        let allData = await userModel.find()
        if (!allData) {
            return res.status(404).send({ status: false, msg: "No data found" });
        }
        return res.status(200).send({ status: true, data: allData })

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

// _____________________pagination api____________________

const paginatonForJob = async function (req, res) {
    try {
        let page = (req.query.page) || 1
        let limit = (req.query.limit) || 3

        let skip = (page - 1) * limit

        let data = await jobModel.find().skip(skip).limit(limit)

        return res.status(200).send({ status: true, data: data })

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createJob, getJobsByFilter, getAllApplications, paginatonForJob }