import superagent from "superagent";
import crypto from 'crypto';
import CONF from '../config/base.conf';

function md5(text) {
    return crypto.createHash('md5').update(text, 'utf8').digest('hex');
}

function hasChinese(obj,val){
　　var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
　　if(reg.test(val)){     
        return true;      
　　}
    return false;     
}

export default class apiCtrl {
    static async youdao(ctx, next) {
        const req = ctx.request.body;
        const queryWords = req.keywords;

        if(!queryWords) {
            return ctx.body = {
                status: 200,
                data: ""
            };
        }

        const API_URL = "http://fanyi.youdao.com/openapi.do";
        const params = {
            keyfrom: "yinwuxueshe",
            key: CONF.account.youdao.key,
            type: "data",
            doctype: "json",
            version: "1.1",
            q: queryWords
        };
    
        try {
            const res = await superagent
                                .get(API_URL)
                                .query(params);
       
            return ctx.body = {
                status: 200,
                data: {
                    query: res.body.query,
                    translation: res.body.translation
                }
            }
        } catch (error) {
            return ctx.body = {
                status: error.status || 500,
                data: error
            }
        }
    }

    static async sougou(ctx, next) {
        const API_URL = "http://fanyi.sogou.com/reventondc/api/sogouTranslate";

        const req = ctx.request.body;
        const queryWords = req.keywords;

        if(!queryWords) {
            return ctx.body = {
                status: 200,
                data: ""
            };
        }
        
        const params = {
            q: encodeURIComponent(queryWords),
            from: "auto",
            to: hasChinese(queryWords) ? "en" : "zh-CHS",
            pid: CONF.account.sougou.pid,
            salt: new Date().getTime().toString(),
            sign: ""
        };
        const sign = params.pid + queryWords.trim() + params.salt + CONF.account.baidu.key;
        params.sign = encodeURIComponent(md5(sign));
        
        try {
            const res = await superagent
                                .post(API_URL)
                                .set('Content-Type', 'application/x-www-form-urlencoded;')
                                .set('accept', 'application/json')
                                .query(params);
            return ctx.body = {
                status: 200,
                data: res.body
            }
        } catch (error) {
            return ctx.body = {
                status: error.status || 500,
                data: error
            }
        }
    }

    static async baidu(ctx, next) {
        const API_URL = "http://api.fanyi.baidu.com/api/trans/vip/translate";

        const req = ctx.request.body;
        const queryWords = req.keywords;

        if(!queryWords) {
            return ctx.body = {
                status: 200,
                data: ""
            };
        }
        
        const params = {
            q: encodeURIComponent(queryWords),
            from: "auto",
            to: hasChinese(queryWords) ? "en" : "zh",
            appid: CONF.account.baidu.pid,
            salt: new Date().getTime().toString(),
            sign: ""
        };
        const sign = params.appid + queryWords.trim() + params.salt + CONF.account.baidu.key;
        params.sign = encodeURIComponent(md5(sign));
                
        try {
            const res = await superagent
                                .post(API_URL)
                                .set('Content-Type', 'application/x-www-form-urlencoded;')
                                .set('accept', 'application/json')
                                .query(params);
            return ctx.body = {
                status: 200,
                data: res.body
            }
        } catch (error) {
            return ctx.body = {
                status: error.status || 500,
                data: error
            }
        }
    }
}

