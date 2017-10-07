var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(express.static("public"));

var PORT = process.env.PORT || 3000;

// Parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");
app.listen(PORT, function () {
	console.log("App listening on PORT " + PORT);
});
