var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
// var mongojs = require("mongojs");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var Save = require("./models/Save.js");
var logger = require("morgan");
var cheerio = require("cheerio");
mongoose.Promise = Promise;
var path = require("path");
var app = express();


var PORT = process.env.PORT || 4000;


// Parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("./public"));

// connect to database
mongoose.connect("mongodb://localhost/foxsScrape");
var db = mongoose.connection;

db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
    console.log("Mongoose connection successful.");
});

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/scrape", function (req, res) {
    request("https://www.nytimes.com/", function (error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // An empty array to save the data that we'll scrape

        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works

        $("article.story").each(function (i, element) {
            var result = {};
            // var link = $(element).children().attr("href");
            // var title = $(element).children().text();
            result.summary = $(element).children("p.summary").text();
            result.byline = $(element).children("p.byline").text();
            // console.log(result.summary);
            result.title = $(element).children("h2").text();
            result.link = $(element).children("h2").children("a").attr("href");
            // Save these results in an object that we'll push into the results array we defined earlier
            var entry = new Article(result);
            // Now, save that entry to the db
            entry.save(function (err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(doc);
                }
            });
        });
        res.json(true);
        // Log the results once you've looped through each of the elements found with cheerio
        // console.log(results);
        // db.insertMany(results);
    });

});
// Gets all the articles
app.get("/articles", function (req, res) {
    Article.find({}, function (error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.send(doc);
        }
    });
});
// Gets all the articles with the id
app.get("/articles/:id", function (req, res) {
    Article.find({
            "_id": req.params.id
        })
        .exec(function (error, doc) {
            if (error) {
                console.log(error)
            } else {
                res.send(doc);
            }
        });
});

// get route to return all saved articles
app.get("/saved/all", function (req, res) {
    Save.find({}, function (error, data) {
        console.log(data);
        if (error) {
            console.log(error);
        } else {
            res.json(data);
        }
    });
});

// post route to save the article
app.post("/save", function (req, res) {
    var result = {};
    // var link = $(element).children().attr("href");
    // var title = $(element).children().text();
    result.id = req.body._id;
    result.summary = req.body.summary;
    // result.byline = req.body.byline;
    // console.log(result.summary);
    result.title = req.body.title;
    result.link = req.body.link;
    // Save these results in an object that we'll push into the results array we defined earlier
    var entry = new Save(result);
    // Now, save that entry to the db
    entry.save(function (err, doc) {
        // Log any errors
        if (err) {
            console.log(err);
            res.json(err);
        }
        // Or log the doc
        else {
            console.log(doc);
            res.json(doc);
        }
    });
    //res.json(result);
});

// delete a note

app.delete("/delete", function (req, res) {
    var result = {};
    console.log(req.body, req.param);
    result._id = req.body._id;
    Save.remove({'_id': req.body._id}, function (err, doc) {
        // Log any errors
        if (err) {
            console.log(err);
            res.json(err);
        }
        // Or log the doc
        else {
            console.log(doc);
            res.json(doc);
        }
    });
});

// Create a new note or replace an existing note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    console.log("running here");
    var newNote = new Note(req.body);
    // And save the new note the db
    newNote.save(function (error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Otherwise
        else {
            // Use the article id to find and update it's note
            Article.findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    "note": doc._id
                })
                .exec(function (error, doc) {
                    if (error) {
                        console.log(error)
                    } else {
                        res.send(doc);
                    }
                });
        }
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});