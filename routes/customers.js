const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const {Customer,validate} = require("../models/customer");
const auth = require("../middleware/auth");

mongoose.set('useFindAndModify', false);

//get all customers
router.get("/", (req, res) => {
    Customer.find().sort("name")
        .then(rez => res.send(rez))
})

//get a specific customer
router.get("/:id", (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Customer.findById(req.params.id)
            .then(customer => res.send(customer))
    } else {
        return res.status(404).send("No customer with this ID found")
    }
})

router.post("/", auth, (req, res) => {
    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    customer.save()
        .then(customer => res.send(customer))
})

router.put("/:id", auth,(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Customer.findByIdAndUpdate(req.params.id,
            { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone },
            { new: true })
            .then(customer => res.send(customer))
    } else {
        return res.status(404).send("Customer with this ID was not found")
    }
})

router.delete("/:id", auth, (req,res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Customer.findByIdAndDelete(req.params.id)
        .then(customer => res.send(customer))
    } else {
        return res.status(404).send("Customer with this ID was not found")
    }
})

module.exports = router