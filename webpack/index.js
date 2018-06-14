let config = {};

console.log("NODE_ENV：" + process.env.NODE_ENV);

if(process.env.NODE_ENV === "development") {
    config = require("./dev.js");
}else {
    config = require("./prod.js");
}

module.exports = config;