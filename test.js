var express = require('express');
var main = require('./routes/main.js');
var auth = require('./routes/auth.js');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session = require('express-session');

var app = express();

app.use(cookieParser());
app.use(bodyParser());
app.use(session({secret: "somesecretshit"}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/books', main);
app.use('/register', auth);

//initialize public path for whole project
app.use(express.static('public'));
//set biews path as default with views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB vars...
var MongoClient = require('mongodb').MongoClient;
var myDB = null;

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
	myDB = db;
});

app.get('/', function(req, res){
	if (!req.isAuthenticated()) {
		res.redirect("/register/loginForm");
	}
	else {
		var coll = myDB.collection("books");
		coll.find({}).sort( {rating : -1} ).limit(3).toArray(function(err, book){
			if (err || !book) {
				res.render("index.ejs", {error: err ? err : "no books in Database!!!"});
			}
			else {
				console.log(book);
				res.render("index.ejs", {books: book, name: req.user.name});
				var now = new Date();
				var newBookId = String(now.getFullYear()) + String(now.getMonth()) + String(now.getDate()) +
					String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds()) +
					String(now.getMilliseconds());
				console.log(newBookId);

				//console.log(String(now.getDate()));
				//console.log(String(now.getFullYear()));
				//console.log(String(now.getMonth()));
				//console.log(String(now.getHours()));
				//console.log(String(now.getMinutes()));
				//console.log(String(now.getSeconds()));
				//console.log(String(now.getMilliseconds()));
				//console.log(String(now.getTime()));
			};
		});
	};
});

app.listen(3000, function(err){});