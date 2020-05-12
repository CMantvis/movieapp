const mongoose = require("mongoose")
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin")
const router = express.Router();
const {Genre, validate} =require("../models/genre")

mongoose.set('useFindAndModify', false);


//get all genres
router.get("/", (req, res,next) => {
    Genre.find().sort("name")
        .then(genres => res.send(genres))
        .catch(ex => {
            next(ex)
        })
})

//get a specific genre
router.get("/:id", (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Genre.findById(req.params.id)
            .then(result => {
                res.send(result)
            })
    } else {
        return res.status(404).send('No result found');
    }
})

//post a new genre;
router.post("/", auth,(req, res) => {
    //verification using joi
    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const genre = new Genre({
        name: req.body.name,
    });
    genre.save()
        .then(rez => res.send(rez))
})

//edit a genre
router.put('/:id', auth,(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
            new: true
        }).then(genre => {
            res.send(genre);
        })
    } else {
       return res.status(404).send('The genre with the given ID was not found.');
    }
});

//delete the genre;
router.delete("/:id", [auth,admin], (req, res) => {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        Genre.findByIdAndRemove(req.params.id)
            .then(genre => {
                res.send(genre)
            })
    } else {
        return res.status(404).send("This genre doesnt exist with the given ID");
    }0
})

module.exports = router