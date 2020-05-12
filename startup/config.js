const config = require("config");

module.exports = function() {
    const pwd = process.env.blogai
    console.log("from config .js", pwd)
    // if (!config.get("jwtPrivateKey")) { //$env:NAME= "pwd"
    if (!pwd) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
    process.exit(1);
}
}