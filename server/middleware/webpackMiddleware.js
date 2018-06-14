import path from "path";
import webpack from "webpack";
import koaWebpack from "koa-webpack";

import webpackConfig from "../../webpack";

const compiler = webpack(webpackConfig);

const webpackMiddleware = async app => {
    await koaWebpack({
        compiler,
        devMiddleware: {
            noInfo: true,
            publicPath: webpackConfig.output.publicPath,
            stats: {
                colors: true
            }
        },
        hotClient: {
            autoConfigure: false
        }
    }).then(middle => {
        app.use(middle);
    });
}

export default webpackMiddleware;

