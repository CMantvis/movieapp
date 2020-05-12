const _ = require("lodash");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const {User} =require("../models/user");
const Joi = require("joi");

mongoose.set('useFindAndModify', false);

//get all genres
router.post("/", async (req, res) => {
    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("Invalid email or password");

   const validPassword = await bcrypt.compare(req.body.password, user.password);
   if (!validPassword) return res.status(400).send("Invalid email or password");

   const token = user.generateAuthToken();
   res.send(token);
})

function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
  }

module.exports = router