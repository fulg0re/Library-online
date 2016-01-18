var express = require('express');
var multer  = require('multer');
var fs = require('fs');
var upload = multer({ dest: 'uploads/' });

var router = express.Router();

// MongoDB vars...
var MongoClient = require('mongodb').MongoClient;
var myDB = null;

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
    myDB = db;
});

// define the about route
router.get('/allBooks', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/register/loginForm");
    }
    else {
        var coll = myDB.collection("books");
        coll.find({}/*, {bookName: 1, _id: 0}*/).toArray(function(err, books){
            if (err || !books) {
                res.render("allBooks.ejs", {error: err ? err : "no books in Database!!!"});
            }
            else {
                res.render("allBooks.ejs", {books: books, name: req.user.name});
            };
        });
    };
});

router.get('/editBook', function(req, res){
    //req.logIn({fullName: "Pasha"}, function(err){
    //	console.log(req.isAuthenticated());
    //});

    if (!req.isAuthenticated()) {
        res.redirect("/register/loginForm");
    }
    else {
        res.render("editBook.ejs", {name: req.user.name});
    };
});

router.get('/availableBooks', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/register/loginForm");
    }
    else {
        var coll = myDB.collection("books");
        coll.find({available: "YES"}).toArray(function(err, books){
            if (err || !books) {
                res.render("availableBooks.ejs", {error: err ? err : "no books in Database!!!"});
            }
            else {
                res.render("availableBooks.ejs", {books: books, name: req.user.name});
            };
        });
    };
});

router.get('/takenBooks', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/register/loginForm");
    }
    else {
        var coll = myDB.collection("books");
        coll.find({available: "NO"}).toArray(function(err, books){
            if (err || !books) {
                res.render("takenBooks.ejs", {error: err ? err : "no books in Database!!!"});
            }
            else {
                res.render("takenBooks.ejs", {books: books, name: req.user.name});
            };
        });
    };
});

router.get('/addedByMe', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/register/loginForm");
    }
    else {
        var coll = myDB.collection("books");
        coll.find({addedBy: req.user.name}).toArray(function(err, books){
            if (err || !books) {
                res.render("addedByMe.ejs", {error: err ? err : "Sorry, no books added by you..."});
            }
            else {
                res.render("addedByMe.ejs", {books: books, name: req.user.name});
            };
        });
    };
});

router.get('/takenByMe', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/register/loginForm");
    }
    else {
        var coll = myDB.collection("books");
        coll.find({whoTook: req.user.name}).toArray(function(err, books){
            if (err || !books) {
                res.render("takenByMe.ejs", {error: err ? err : "Sorry, no books added by you..."});
            }
            else {
                res.render("takenByMe.ejs", {books: books, name: req.user.name});
            };
        });
    };
});

router.get('/addNewBook', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/register/loginForm");
    }
    else {
        res.render('addNewBook.ejs', {name: req.user.name});
    };
});

router.post('/takeBookButton', function(req, res){
    console.log(req.body);
    console.log(req.user);

    var coll = myDB.collection("books");
    coll.findOne({"bookName": req.body.book}, function(err, book){
        var newBook = book;
        newBook.available = "NO";
        newBook.rating = newBook.rating + 1;
        newBook.whoTook = req.user.name;
        coll.save(newBook, function(err, result){
            res.redirect('back');
        });
    });
});

router.post('/returnBookButton', function(req, res){
    console.log(req.body);
    console.log(req.user);

    var coll = myDB.collection("books");
    coll.findOne({"bookName": req.body.returnBook}, function(err, book){
        var newBook = book;
        newBook.available = "YES";
        newBook.whoTook = "-";
        coll.save(newBook, function(err, result){
            res.redirect("back");
        });
    });
});

router.post('/goToEditBook', function(req, res){
    console.log(req.body);

    var coll = myDB.collection("books");
    coll.findOne({"bookName": req.body.editBook}, function(err, book){
        console.log(book);
        res.render("editBook.ejs", {book: book, name: req.user.name});
    });
});

router.post('/editBook', upload.single('book_cover'), function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/register/loginForm");
    }
    else {
        console.log(req.body);
        console.log(req.file);

        fs.readFile(req.file.path, function(err, data){
            if (err) {console.log(err); process.exit();}

            fs.writeFile("./public/img/" + req.file.originalname, data, function(err){
                console.log(err);

                var coll = myDB.collection("books");
                coll.findOne({"_id": req.body.bookId}, function(err, book) {
                    console.log("!!!");
                    var editedBook = book;
                    editedBook.bookName = req.body.bookName;
                    editedBook.shortInfo = req.body.shortInfo;
                    editedBook.fullInfo = req.body.fullInfo;
                    editedBook.image = "/img/" + req.file.originalname;
                    coll.save(editedBook, function(err, result){
                        res.redirect('/');
                    });
                });
            });
        });
    };
});

router.post('/addNewBook', upload.single('book_cover'), function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/register/loginForm");
    }
    else {
        console.log(req.body);
        console.log(req.file);

        fs.readFile(req.file.path, function(err, data){
            if (err) {console.log(err); process.exit();}

            fs.writeFile("./public/img/" + req.file.originalname, data, function(err){
                console.log(err);

                var coll = myDB.collection("books");
                coll.findOne({"bookName": req.body.newBookName}, function(err, book) {
                    if (book) {

                    } else {
                        var now = new Date();
                        var newBookId = String(now.getFullYear()) + String(now.getMonth()) + String(now.getDate()) +
                            String(now.getHours()) + String(now.getMinutes()) + String(now.getSeconds()) +
                            String(now.getMilliseconds());
                        var newBook = {
                            "_id": newBookId,
                            "addedBy": req.user.name,
                            "bookName": req.body.newBookName,
                            "shortInfo": req.body.newBookShortInfo,
                            "fullInfo": req.body.newBookFullInfo,
                            "image": "/img/" + req.file.originalname,
                            "available": "YES",
                            "whoTook": "-",
                            "rating" : 0
                        };
                        coll.insert(newBook, function(err){
                            if (err) {
                                console.log(err);
                            }
                            else {
                                res.render('addNewBook.ejs', {info: "Book added successfully", name: req.user.name});
                            };
                        });
                    };
                });
            });
        });
    };
});

router.post('/searchForBook', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/register/loginForm");
    }
    else {
        console.log(req.body.searchForBook);
        var coll = myDB.collection("books");
        coll.find({bookName: new RegExp(req.body.searchForBook, 'i')}).toArray(function(err, books){
            if (err || !books) {
                res.render("searchForBook.ejs", {error: err ? err : "no books in Database!!!"});
            }
            else {
                res.render("searchForBook.ejs", {books: books, name: req.user.name});
            };
        });
    };
});

module.exports = router;