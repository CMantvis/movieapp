const mongoose = require("mongoose");
const config = require("config")

module.exports = function () {
    mongoose.connect(config.get("db"), { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
        .then(() => console.log(`connected to mongoDb ${config.get("db")}..`))

}