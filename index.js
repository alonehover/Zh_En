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
        q: keywords,
        qs: 'n',
        from: 'CM',
        pq: keywords,
        sc: '7-4',
        sp: -1,
        sk: ""
    })
    const url = encodeURI('http://cn.bing.com/dict/search?')

    request.get(url + query, function(_err, _res, data) {
        const $ = cheerio.load(data, {
            decodeEntities: false
        })

        const content = $('.contentPadding')
       console.log(content.html());
        const html = content.find('.qdef ul').html()
        console.log(html);
        res.send(html)
    })
    // http.get(url + query, (data) => {
    //     var rawData = ''
    //     data.setEncoding('utf8');
    //     data.on('data', function(chunk) {
    //         rawData += chunk;
    //     })

    //     data.on('end', function() {
         
    //         var $ = cheerio.load(rawData, {
    //             decodeEntities: false
    //         })

    //         var content = $('.contentPadding')
    //         console.log(content.html());
    //         const html = content.find('.qdef ul').html()
            
    //         res.send(html)
    //     })
    // })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
