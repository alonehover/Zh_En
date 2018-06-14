class baseCtrl {
    static async index(ctx, next) {
        return ctx.render("index");
    }    
}

export default baseCtrl;
