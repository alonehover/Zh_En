"use strict";

import Router from "koa-router";

import Controller from '../controller';

const router = new Router();

router.post("/trans", Controller.apiCtrl.index);

router.post("/youdao", Controller.apiCtrl.youdao);

router.post("/sougou", Controller.apiCtrl.sougou);

router.post("/baidu", Controller.apiCtrl.baidu);

export default router;