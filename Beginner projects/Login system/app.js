const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const { Console } = require('console');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/loginDataDB");

const loginDataSchema = new mongoose.Schema({
    username: String,
    password: String
});

loginDataSchema.plugin(passportLocalMongoose, {
    username: 'username'
});

loginDataSchema.plugin(findOrCreate);

const Login = new mongoose.model("Login", loginDataSchema);

passport.use(Login.createStrategy());

passport.serializeUser(Login.serializeUser());
passport.deserializeUser(Login.deserializeUser());

passport.use(new GoogleStrategy({
    clientID: "1071906013269-inserc9t4gefljnfq519scnr1ikde43e.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://www.example.com/auth/google/success",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));


app.get("/", (req, res) => {
    res.render("login");
});

app.get("/auth/google", passport.authenticate('google', { scope: ["profile"] }));

app.get("/auth/google/success",
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        // This function will be called after successful authentication
        res.redirect('/dashboard');
    }
);


app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/success", (req, res) => {
    res.render("success");
});

app.post("/login", (req, res) => {
    const login = new Login({
        username: req.body.username,
        password: req.body.password
    });

    req.login(login, (err) => {
        if(err){
            console.log(err);
        } else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/success");
            });
        }
    });
});

app.get("/dashboard", (req, res) => {
    if(req.isAuthenticated()){
        res.render("success");
    }else{
        res.redirect("/login");
    }
});

app.post("/register", (req, res) => {
    Login.register({ username: req.body.username }, req.body.password, function(err, user){
        if(err){
            console.error("Error during registration:", err);
            res.redirect("/register");
        } else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/dashboard");
            });
        }
    });
});

app.post("/logout", (req, res) => {
    req.logout(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    });
});


app.listen(3000, (req, res) => {
    console.log("Server is running at port 3000");
});