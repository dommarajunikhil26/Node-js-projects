const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/magazineDB");

const magazineSchema = {
    name: String,
    price: Number,
    description: String
};

const Magazine = mongoose.model("Magazine", magazineSchema);

app.get("/", (req, res) =>{
    res.render('index');
});

app.get("/magazines", (req, res) =>{
    Magazine.find().then(function(magazines){
        res.send(magazines);
    }).catch(function(err){
        res.send(err);
    });
});

app.post("/magazines", (req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;

    const newMagazine = new Magazine({
        name: title,
        price: price,
        description: description
    });

    newMagazine.save().then(function (magazine) {
        res.send(magazine);
    }).catch(function (err) {
        res.send(err);
    });
});

app.delete("/magazines", (req, res) => {
    Magazine.deleteMany().then(function(magazine){
        res.send("All books deleeted");
    }).catch(function(err){
        res.send(err);
    });
});

// Targeting specific magazine

app.get("/magazines/:magazineTitle", (req, res) => {
    Magazine.findOne({name: req.params.magazineTitle}).then(function(magazine){
        res.send(magazine);
    }).catch(function(err){
        res.send(err);
    });
});

app.put("/magazines/:magazineTitle", (req, res) => {;

    Magazine.updateOne(
        { name: req.params.magazineTitle },
        { name: req.body.name, price: req.body.price, description: req.body.description }
    )
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.send(err);
        });

});

app.patch("/magazines/:magazineTitle", (req, res) => {
    
    Magazine.updateOne(
        {name: req.params.magazineTitle},
        { $set: { name: req.body.name, price: req.body.price, description: req.body.description } }
    )
        .then(function(magazine){
            res.send(magazine);
    })
        .catch(function(err){
            res.send(err);
    });
});

app.delete("/magazines/:magazineTitle", (req, res) => {

    Magazine.deleteOne({name: req.params.magazineTitle}).then(function(magazine){
        res.send("The magazine is succefully deleted");
    }).catch(function(err){
        res.send(err);
    });
});

app.listen('3000', () =>{
    console.log("Server running at port 3000");
});