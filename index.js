require('babel-register');

require("babel-polyfill");

if(process.env.NODE_ENV === "development") {
    module.exports = require("./server/app.dev");
}else {
    module.exports = require("./server/app");
}