"use strict";

import Log from "../util/log";

export default logs;

async function logs(ctx, next) {
    const log = new Log();
    const start = Date.now();

    try {       
        await next();  
    } catch (err) {
        err.status = err.statusCode || err.status || 500;
        log.error(err.status, err.message);
        await ctx.render("500", {
            status: err.status,
            message: err.message
        });
    }

    const ms = Date.now() - start;
    log.info(ctx.method, ctx.status, ctx.originalUrl, `- ${ms}ms`);
}