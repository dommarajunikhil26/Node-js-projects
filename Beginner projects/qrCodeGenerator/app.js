const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
var QRCode = require('qrcode')

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended: true}));


app.listen(3000, () => {
    console.log("Server running at port 3000");
});