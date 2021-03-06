const express = require("express");
const genres = require("../routes/genres");
const home = require("../routes/home");
const customers = require("../routes/customers");
const movie = require("../routes/movie");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
    app.use(express.json());
    app.use("/api/auth", auth);
    app.use("/api/users", users)
    app.use("/api/rentals", rentals);
    app.use("/api/customers", customers);
    app.use("/api/genres", genres);
    app.use("/", home);
    app.use("/api/movies", movie);
    app.use(error)
}