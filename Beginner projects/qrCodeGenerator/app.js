const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
var qrCode = require('qrcode');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/scan", (req, res) => {
    const text = req.body.text;
    qrCode.toDataURL(text, function (err, url) {
        res.render("scanner", {
            qr_code: url
        });
    });
});

app.listen(3000, () => {
    console.log("Server running at port 3000");
});