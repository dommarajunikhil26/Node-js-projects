const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/form", (req, res) => {
    const name = req.body.personName;
    const room = req.body.roomType;

    res.redirect(`/${room}?name=${name}`);
});

app.get("/:room", (req, res) => {
    const room = req.params.room;
    const name = req.query.name;

    res.render("room", { room, name });
});


app.listen(3000, () => {
    console.log("Server started at port 3000");
});