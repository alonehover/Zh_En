const express = require('express')
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const app = express()

app.use(express.static('public'));

app.get('/', function(req, res) {
    fs.readFile('./index.html', (err, data) => {
        if(err) {
            res.send("404")
        }
        console.log(data);
        res.send(data.toString())
    })
})

app.get('/bing', function(req, res) {
    const keywords = req.query.q || ""
    const url = encodeURI('http://www.bing.com/dict/search?q=' + keywords)

    request.get(url, function(_err, _res, data) {
        var $ = cheerio.load(data, {
            decodeEntities: false
        })

        var content = $('.contentPadding')

        const html = content.find('.qdef ul').html()
        
        res.send(html)
    })
})



app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});