import path from "path";
import webpack from "webpack";
import koaWebpack from "koa-webpack";

import webpackConfig from "../../webpack";
import mimes from "../util/mimes";

const compiler = webpack(webpackConfig);

const webpackMiddleware = async app => {    
    const middle = await koaWebpack({
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
    });

    app.use(middle);

    app.use(async (ctx, next) => {
        let extname = path.extname(ctx.path);
        extname = extname ? mimes[extname.slice(1)] : "";
        
        if(!extname) {           
            const htmlBuffer = middle.devMiddleware.fileSystem.readFileSync(path.join(webpackConfig.output.path, "./index.html"));       
            ctx.type = 'html';
            ctx.body = htmlBuffer;
        }else {
            await next();
        }
    });
}

export default webpackMiddleware;

