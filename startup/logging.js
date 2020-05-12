const winston = require("winston")

module.exports = function() {
    process.on("uncaughtException", (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    })
    //catching promise errors
    process.on("unhandledRejection", (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    })

    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
}