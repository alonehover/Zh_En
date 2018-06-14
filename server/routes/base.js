"use strict";

import Router from 'koa-router';
import Controller from '../controller';

const router = new Router();

router.get("/", Controller.baseCtrl.index);

export default router;