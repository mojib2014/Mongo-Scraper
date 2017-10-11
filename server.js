var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var path = require("path");
var app = express();
app.use(express.static("./public"));

var PORT = process.env.PORT || 4000;
var databaseUrl = "foxsScrape";
var collections = ["foxsScrappedData"];
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error", error);
});
// Parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: "application/vnd.api+json"
}));
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

/* app.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/survey.html"));
}); */
// If no matching route is found default to home

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
app.get("/all", function (request, response) {
    db.foxScrappedData.find({}, function (error, data) {
        if (error) {
            console.log(error);
        } else {
            response.send(data);
        }
    });
});

app.get("/scrape", function (req, res) {
    request("http://fox5sandiego.com/", function (error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // An empty array to save the data that we'll scrape

        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $("h4.entry-title").each(function (i, element) {

            var link = $(element).children().attr("href");
            var title = $(element).children().text();

            // Save these results in an object that we'll push into the results array we defined earlier
            db.foxScrappedData.insert({
                link: link,
                title: title               
            });
        });
        res.json(true);
        // Log the results once you've looped through each of the elements found with cheerio
        // console.log(results);
        // db.insertMany(results);
    });

});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});