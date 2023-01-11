const jobModel = require("../models/jobModel")
const aws = require("../controllers/awsController")
const userModel = require("../models/userModel")
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const regName = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/

// _____________________create User api____________________

const createUser = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please enter Job details" });

        let { name, email } = data
        if (!isValid(name)) return res.status(400).send({ status: false, message: "title is Required" });

        if (!regName.test(name)) {
            return res.status(400).send({ message: "Please enter valid title" })
        }

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is Required" });

        const regx = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Enter Valid Email" });

        let emailData = await userModel.findOne({ email: email })

        //.............when email is already in use............
        if (emailData) return res.status(400).send({ status: false, msg: 'Duplicate email found, Please try with another!!' })

        let file = req.files
        let url = await aws(file[0])
        data["resume"] = url

        let createUser = await userModel.create(data)
        res.status(201).send({ status: true, message: "User Created Successfully", data: createUser })

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

// _____________________login User api____________________

const userLogin = async function (req, res) {
    try {
        let data = req.body;
        if (!isValid(data)) {
            return res.status(400).send({ statua: false, message: "Please provide login details!!" })
        }

        const { email, password } = data

        if (!(email)) {
            return res.status(400).send({ status: false, message: "Email is required!!" })
        }

        // check email for user
        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(400).send({ status: false, message: "Email is not correct, Please provide valid email" });

        if (!(password)) {
            return res.status(400).send({ status: false, message: "Password is required!!" })
        }

        // check password of existing user
        let pass = await userModel.findOne({ password: password });
        if (!pass) return res.status(400).send({ status: false, message: "Password is not correct, Please provide valid password" });

        let userid = await userModel.findOne({ email: email, password: password })

        // using jwt for creating token
        let token = jwt.sign(
            {
                userId: userid._id.toString(),
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            },
            "Nodejs-Assignment"
        );

        res.status(201).send({ status: true, message: "Success", data: token });
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}

// _____________________get job api____________________

const getDetails = async function (req, res) {
    try {
        let postId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).send({ status: false, message: "Enter valid job Id" })
        }

        let singlePost = await jobModel.findById(postId)
        if (!singlePost) {
            return res.status(404).send({ status: false, msg: "Job not Found by this id" });
        }

        return res.status(200).send({ status: true, data: singlePost })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

// _____________________pagination api____________________

const paginatonForApplication = async function (req, res) {
    try {
        let page = (req.query.page) || 1
        let limit = (req.query.limit) || 3

        let skip = (page - 1) * limit

        let data = await userModel.find().skip(skip).limit(limit)

        return res.status(200).send({ status: true, data: data })

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createUser, userLogin, getDetails, paginatonForApplication }