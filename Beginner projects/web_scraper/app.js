const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();


const url = 'https://www.theguardian.com/us';


axios(url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const articles = [];
        $('.dcr-12ilguo', html).each(function() {
            const title = $(this).text();
            const url = $(this).find('a').attr('href');
            articles.push({
                title,
                url
            })
        })
        console.log(articles);
    })


app.listen(3000, () => {
    console.log("App is running on port 3000");
});