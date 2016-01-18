var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

// MongoDB vars...
var MongoClient = require('mongodb').MongoClient;
var myDB = null;

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
    myDB = db;
});

passport.serializeUser(function (user, done) {
    done(null, {name: user.fullName});
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use('local-login', new localStrategy(function (username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
        // Find the user by username.  If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message.  Otherwise, return the
        // authenticated `user`.
        var coll = myDB.collection("users");
        coll.findOne({"login": username}, function(err, user){
            if (err || !user) {
                done(null, {}, {message: 'user not found.'});
            }
            else {
                if (password == user.password) {
                    done(null, {fullName: user.login});
                }
                else {
                    done(null, {}, {message: 'incorrect user name or password.'});
                };
            };
        });


        console.log(username + " " + password);
        //done(null, {fullName: "Pasha"});
        //done("wrong username", {fullName: "Pasha"});
        //done(null, {fullName: "Pasha"}, {message: 'Incorrect password.'});
    });
}));

// define the about route
router.get('/loginForm', function(req, res){
    res.render("loginForm.ejs", {error: null});
});

// define the about route
router.get('/registerForm', function(req, res){
    res.render("registerForm.ejs");
});

// якщо логін або пароль не вірні, відіслати помилку назад, в іншому випадку перенаправити на основний сайт
router.post('/loginForm', function(req, res){
    passport.authenticate('local-login', function(err, user, info){
        if (err || info) {
            res.render("loginForm.ejs", {error: err ? err : info.message});
        }
        else {
            req.logIn(user, function (err) {

                res.redirect("/");
            });
        }
    })(req, res);

    //console.log(req.body);
    //var userLogin = req.body.inputLogin2;
    //var userPassword = req.body.inputPassword3;
    //var coll = myDB.collection("users");
    //coll.findOne({"login": userLogin}, function(err, user){
    //    if (err || !user) {
    //        res.render("loginForm.ejs", {error: err ? err : "user not found!!!"});
    //    }
    //    else {
    //        if (userPassword == user.password) {
    //            res.redirect("/");
    //        }
    //        else {
    //            res.render("loginForm.ejs", {error: "incorrect user name or password!!!"});
    //        };
    //    };
    //});
});

router.post('/registerForm', function(req, res){
    //console.log(req.query);
    console.log(req.body);
    var userLogin = req.body.inputLogin1;
    var userPassword1 = req.body.inputPassword1;
    var userPassword2 = req.body.inputPassword2;
    var userEmail = req.body.inputEmail1;

    if (userPassword1 != userPassword2) {
        res.render("registerForm.ejs", {error: "passwords do not match!!!"});
    }
    else {
        var coll = myDB.collection("users");
        coll.insert({_id: userLogin, login: userLogin, password: userPassword1, email: userEmail}, function(err){
            if (err) {
                res.render("registerForm.ejs", {error: "user is already registered!!!"});
            }
            else {
                console.log("New User Registred...");
                res.redirect("/register/loginForm");
            };
        });
    };
});

router.get('/logOut', function(req, res) {
    req.logOut();
    res.redirect("/");
});

module.exports = router;