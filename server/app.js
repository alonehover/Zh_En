"use strict";

import fs from "fs"
import path from "path"
import Koa from "koa";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import serverStatic from "koa-static";
import views from "koa-views"

import routes from "./routes";
import baseConf from "./config/base.conf";
import logMiddleware from "./middleware/logMiddleware";

const app = new Koa();

app.use(logger());

app.use(bodyParser());

// 静态资源文件夹
app.use(serverStatic(path.resolve(__dirname, "../public/")));

// 模板引擎
app.use(views(path.resolve(__dirname, "./views"), {map: {html: "ejs"}}));

// 加载日志中间件
// app.use(logMiddleware);

// 路由
app.use(routes);

// 端口监听
app.listen(baseConf.app.port);

console.log("Server started, listening on port: " + baseConf.app.port);

export default app;