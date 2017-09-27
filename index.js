const express = require('express')
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const qs = require('querystring')

const app = express()

app.use(express.static('public'));

app.get('/', function(req, res) {
    fs.readFile('./index.html', (err, data) => {
        if(err) {
            res.send("404")
        }
        res.send(data.toString())
    })
})

app.get('/bing', function(req, res) {
    const keywords = req.query.q || ""
    const query = qs.stringify({
        q: keywords
    })

    request.get('http://www.bing.com/dict/?FROM=HDRSC6', function(_err, _res, data) {
        translate() 
    })

    const translate = function() {
        const url = encodeURI('http://cn.bing.com/dict/search?')
        request.get(url + query, function(_err, _res, data) {
            const $ = cheerio.load(data, {
                decodeEntities: false
            })
            const content = $('.contentPadding')
            const html = content.find('.qdef ul').html()
            res.send(html)
        })
    }
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
