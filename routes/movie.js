const express = require("express");
const mongoose = require("mongoose")
const router = express.Router();
const { Movie, validate} = require("../models/movie");
const {Genre} = require("../models/genre")
const auth = require("../middleware/auth");

mongoose.set('useFindAndModify', false);

//get all movies

router.get("/", (req,res) => {
    Movie.find().sort("title")
    .then(movies => res.send(movies))
})

router.get("/:id", (req,res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Movie.findById(req.params.id)
        .then(movie => res.send(movie))
    } else {
        res.status(404).send("Movie not found")
    }
})

router.post("/", auth, (req,res) => {
    const validation = validate(req.body);
    if(validation.error) {
        res.status(400).send(validation.error.details[0].message);
        return
    }
    const genre = Genre.findById(req.body.genreId)
    .then(genre => {
        if (!genre) {
            return res.status(400).send("wrong genre")
        }

        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        })
        movie.save()
        .then(movie => res.send(movie))
    })
})

router.put("/:id", auth,(req,res) => {
    const { error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

   Genre.findById(req.body.genreId)
    .then(genre => {
        if (!genre) return res.status(400).send('Invalid genre.')
        else {
            return genre
        }
    })
    .then(genre => {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            Movie.findByIdAndUpdate(req.params.id, {
                title: req.body.title,
                genre: {
                    _id: genre._id,
                    name: genre.name
                  },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate  
            }, {new: true})
            .then(movie => res.send(movie))
        } else {
            return res.status(404).send('invalid genre');
        }
    })
})

router.delete("/:id",auth, (req,res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Movie.findByIdAndRemove(req.params.id)
        .then(movie => res.send(movie))
    } else {
        return res.status(404).send("Movie with this ID not found")
    }
})

module.exports = router