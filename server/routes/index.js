"use strict";

import Router from 'koa-router';
import base from './base';
import api from './api';

const router = new Router();

router.use("/", base.routes(), base.allowedMethods());
router.use("/api", api.routes(), api.allowedMethods());

router.get('*', async (ctx, next) => {
    await next();
    if(ctx.status === 404) {
        await ctx.render("404");
    }
});

export default router.routes();