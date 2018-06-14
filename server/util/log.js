"use strict";

import log4js from "log4js";
import logConfig from "../config/log.conf"

class Log {
    constructor() {
        log4js.configure(logConfig);
    }

    async info(...args) {
        let category = "";
        
        if(args.length > 1) {
            category = args[0];
            args.shift();
        }

        const logger = log4js.getLogger(category);
        await logger.debug(...args);
    }

    async error() {
        const logger = log4js.getLogger("Error");
        await logger.error(...arguments);
    }

    async success() {
        const logger = log4js.getLogger("Success");
        await logger.info(...arguments);
    }
}

export default Log;