const express = require("express")
const router = express.Router();

const jobController = require("../controllers/jobController")
const userController = require("../controllers/userController")
const middleware = require("../middlewares/auth")

router.post("/postJobs", jobController.createJob)

router.post("/createUser", userController.createUser)

router.get("/getAllPost", jobController.getJobsByFilter)

router.post("/userLogin", userController.userLogin)

router.get("/getSinglePost/:id", middleware.Authentication, userController.getDetails)

router.get("/getAllData", jobController.getAllApplications)

router.get("/getData", jobController.paginatonForJob)

router.get("/getUserData", userController.paginatonForApplication)

module.exports = router;