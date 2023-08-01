const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Setup body-parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set static folder
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: "anime_login_page",
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

// loginDataSchema.plugin(findOrCreate);

const Login = new mongoose.model("Login", loginDataSchema);

passport.use(Login.createStrategy());

passport.serializeUser(Login.serializeUser());
passport.deserializeUser(Login.deserializeUser());

// Home route
app.get("/", (req, res) => { 
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("success");
    } else {
        res.redirect("/login");
    }
});

app.get("/success", (req, res) => {
    res.render("success");
});


app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Error during authentication:", err);
            return res.render("login", { message: "An error occurred during authentication. Please try again." });
        }

        if (!user) {
            // Authentication failed, user is not logged in
            return res.render("login", { message: "Invalid username or password" });
        }

        // Authentication successful, log the user in
        req.login(user, (err) => {
            if (err) {
                console.error("Error during login:", err);
                return res.redirect("/");
            }
            return res.redirect("/success");
        });
    })(req, res, next);
});



app.post("/register", (req, res) => {
    Login.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.error("Error during registration:", err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/dashboard");
            });
        }
    });
});


app.listen(3000, () => {
    console.log("The app is running at port 3000");
});