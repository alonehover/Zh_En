const express = require('express')
const http = require('http')
const cheerio = require('cheerio')
const fs = require('fs')

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
    const url = encodeURI('http://cn.bing.com/dict/search\?\q=' + keywords)

    http.get(url, (data) => {
        var rawData = ''
        
        data.setEncoding('utf8');
        data.on('data', function(chunk) {
            rawData += chunk;
        })

        data.on('end', function() {
         
            var $ = cheerio.load(rawData, {
                decodeEntities: false
            })

            var content = $('.contentPadding')

            const html = content.find('.qdef ul').html()
            
            res.send(html)
        })
    })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
