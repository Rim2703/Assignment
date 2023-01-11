const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

//_________________________________ authontication ____________________________________________//

const Authentication = async (req, res, next) => {
    try {
        let token = req.headers['x-api-key']
        if (!token) return res.status(400).send({ status: false, message: "Header must be present !" })
        jwt.verify(token, "Nodejs-Assignment", async (invalid, valid) => {
            //-----if token is invalid-------/
            if (invalid) return res.status(401).send({ status: false, message: "Invalid token !" })
            //----if token valid----//
            if (valid) {
                req["userId"] = valid.userId
                next()
            }
        })
    } catch (error) {
        return res.status(500).send({ sataus: false, message: error.message })
    }
}


module.exports = { Authentication }