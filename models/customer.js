const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    isGold: {
        default: false,
        type: Boolean
    },
    name: {
        required: true,
        type: String
    },
    phone: {
        required: true,
        type: String,
        minlength:5,
        maxlength:50
    }
})

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    }
    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;