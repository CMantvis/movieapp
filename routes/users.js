const _ = require("lodash");
const jwt= require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const {User, validate} =require("../models/user");
const auth = require("../middleware/auth");

mongoose.set('useFindAndModify', false);

router.get("/me", auth,(req,res) => {
    User.findById(req.user._id).select("-password")
    .then(user => {
        res.send(user)
    })
})

router.post("/", async (req, res) => {
    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send("User already registered");

    user = new User(_.pick(req.body, ["name","email", "password"]));
    const salt =  await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const token = user.generateAuthToken();
    res.header("x-auth-token",token).send(_.pick(user, ["name","email","_id"]));
})

module.exports = router