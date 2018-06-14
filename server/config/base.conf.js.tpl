"use strict";

let ENV = process.env.NODE_ENV || "development";

export default {
    app: {
        env: ENV,
        port: process.env.PORT || 8000,
        log: "./logs"
    },
    account: {
        youdao: {
            pid: ""
        },
        sougou: {
            pid: "",
            key: ""
        },
        baidu: {
            pid: "",
            key: ""
        }
    }
}