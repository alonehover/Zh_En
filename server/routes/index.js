"use strict";

import path from 'path';
import Router from 'koa-router';
import base from './base';
import api from './api';
import mimes from "../util/mimes";

const router = new Router();

router.use("/", base.routes(), base.allowedMethods());
router.use("/api", api.routes(), api.allowedMethods());

router.get('*', async (ctx, next) => {
    await next();
    if(ctx.status === 404) {
        let extname = path.extname(ctx.path);
        extname = extname ? mimes[extname.slice(1)] : "";
        if(!extname) { 
            await ctx.render("404");
        }
    }
});

export default router.routes();