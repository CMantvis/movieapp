const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require("fawn");

Fawn.init(mongoose);

router.get("/", (req, res) => {
    Rental.find().sort('-dateOut')
        .then(rent => res.send(rent))
})

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("customer with this id not found");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Movie with this id not found");

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        new Fawn.Task()
            .save("rental", rental)
            .update("movies", { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();
        res.send(rental)
    }
    catch (ex) {
        res.status(500).send("Smthing failed.")
    }
})

router.get("/:id", (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Rental.findById(req.params.id)
            .then(rental => res.send(rental))
    } else {
        res.status(404).send("Rental not found")
    }
})

module.exports = router; 