import superagent from "superagent";
import crypto from 'crypto';
import CONF from '../config/base.conf';

function md5(text) {
    return crypto.createHash('md5').update(text, 'utf8').digest('hex');
}

function hasChinese(val){
　　var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
　　if(reg.test(val)){     
        return true;      
　　}
    return false;     
}

export default class apiCtrl {
    static async index(ctx, next) {
        const req = ctx.request.body;
        const queryWords = req.keywords;

        if(!queryWords) {
            return {
                status: 200,
                data: ""
            };
        }

        const data = {
            y: await apiCtrl.youdao(queryWords),            
            b: await apiCtrl.baidu(queryWords),
            s: await apiCtrl.sougou(queryWords)
        };

        return ctx.body = {
            query: queryWords,
            data
        };
    }

    // 有道
    static async youdao(queryWords) {
        if(!queryWords) {
            return {
                status: 200,
                data: ""
            };
        }

        const API_URL = "http://fanyi.youdao.com/openapi.do";
        const params = {
            keyfrom: "yinwuxueshe",
            key: CONF.account.youdao.pid,
            type: "data",
            doctype: "json",
            version: "1.1",
            q: queryWords
        };
        
        try {
            const res = await superagent
                                .get(API_URL)
                                .query(params);
            let result = "";

            if(res.body.errorCode == 0) {
                result = {
                    basic:  res.body.basic ? res.body.basic.explains : "",
                    translation: res.body.translation[0]
                };
            }

            return {
                status: 200,
                data: result
            }
        } catch (error) {
            return {
                status: error.status || 500,
                data: error
            }
        }
    }

    // 搜狗
    static async sougou(queryWords) {
        const API_URL = "http://fanyi.sogou.com/reventondc/api/sogouTranslate";

        if(!queryWords) {
            return {
                status: 200,
                data: ""
            };
        }
        
        const params = {
            q: queryWords,
            from: "auto",
            to: hasChinese(queryWords) ? "en" : "zh-CHS",
            pid: CONF.account.sougou.pid,
            salt: new Date().getTime().toString(),
            sign: ""
        };
        const sign = params.pid + queryWords.trim() + params.salt + CONF.account.sougou.key;        
        params.sign = encodeURIComponent(md5(sign));
        
        try {
            const res = await superagent
                                .post(API_URL)
                                .set('Content-Type', 'application/x-www-form-urlencoded;')
                                .set('accept', 'application/json')
                                .query(params);
            return {
                status: 200,
                data: res.body.errorCode == 0 ? res.body.translation : ""
            }
        } catch (error) {
            return {
                status: error.status || 500,
                data: error
            }
        }
    }

    // 百度
    static async baidu(queryWords) {
        const API_URL = "http://api.fanyi.baidu.com/api/trans/vip/translate";

        if(!queryWords) {
            return {
                status: 200,
                data: ""
            };
        }
        
        const params = {
            q: queryWords,
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
            return {
                status: 200,
                data: res.body.trans_result[0].dst
            }
        } catch (error) {
            return {
                status: error.status || 500,
                data: error
            }
        }
    }
}

