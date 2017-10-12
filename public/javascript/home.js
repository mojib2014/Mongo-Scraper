function displaySaved() {
    $.getJSON("/saved/all", function (data) {
        console.log(data);
        $("#nyt").empty();
        $("#total-number").text(data.length);
        for (var i = 0; i < data.length; i++) {
            var mainDiv = $("<div>");
            mainDiv.addClass("card blue-grey darken-1");

            var cardContentDiv = $("<div>");
            cardContentDiv.addClass("card-content white-text");

            var spanTitle = $("<span>");
            spanTitle.addClass("card-title");
            spanTitle.attr("data-id", data[i]._id);
            spanTitle.attr("id", "title-" + data[i]._id);
            spanTitle.text(data[i].title);
            var p = $("<p>");
            p.text(data[i].summary);
            p.attr("id", "summary-" + data[i]._id);

            cardContentDiv.append(spanTitle);
            cardContentDiv.append(p);

            var cardActionDiv = $("<div>");
            cardActionDiv.addClass("card-action");
            var a = $("<a>");
            a.attr("href", data[i].link);
            a.attr("id", "link-" + data[i]._id);
            a.text("Go to the article");
            cardActionDiv.append(a);

            var button = $("<a>");
            button.addClass("waves-effect waves-light btn create-note modal-trigger");
            button.attr("data-id", data[i]._id);
            button.attr("data-target","notes");
            button.attr("id", "create-note");
            button.text("Create Notes");
            var deleteArticle = $("<a>");
            deleteArticle.addClass("waves-effect waves-light btn delete-button");
            deleteArticle.attr("id", data[i]._id);
            deleteArticle.text("Delete");
            var byline = $("<p>");
            byline.text(data[i].byline);
            cardActionDiv.append(byline);
            cardActionDiv.append(button);
            cardActionDiv.append(deleteArticle);
            mainDiv.append(cardContentDiv);
            mainDiv.append(cardActionDiv);

            $("#nyt").append(mainDiv);
        }
    });
}

function displayScrape() {
    $.getJSON("/articles", function (data) {
        console.log(data);
        $("#nyt").empty();
        $("#total-number").text(data.length);
        for (var i = 0; i < data.length; i++) {
            var mainDiv = $("<div>");
            mainDiv.addClass("card blue-grey darken-1");

            var cardContentDiv = $("<div>");
            cardContentDiv.addClass("card-content white-text");

            var spanTitle = $("<span>");
            spanTitle.addClass("card-title");
            spanTitle.attr("data-id", data[i]._id);
            spanTitle.attr("id", "title-" + data[i]._id);
            spanTitle.text(data[i].title);
            var p = $("<p>");
            p.text(data[i].summary);
            p.attr("id", "summary-" + data[i]._id);

            cardContentDiv.append(spanTitle);
            cardContentDiv.append(p);

            var cardActionDiv = $("<div>");
            cardActionDiv.addClass("card-action");
            var a = $("<a>");
            a.attr("href", data[i].link);
            a.attr("id", "link-" + data[i]._id);
            a.text("Go to the article");
            cardActionDiv.append(a);
            var saveArticle = $("<a>");
            saveArticle.addClass("waves-effect waves-light btn save-button");
            saveArticle.attr("id", data[i]._id);
            saveArticle.text("Save Article");
            var byline = $("<p>");
            byline.text(data[i].byline);
            byline.attr("id", "byline-" + data[i]._id);
            cardActionDiv.append(byline);
            // cardActionDiv.append(button);
            cardActionDiv.append(saveArticle);
            mainDiv.append(cardContentDiv);
            mainDiv.append(cardActionDiv);
            $("#nyt").append(mainDiv);
        }
    });
}


$(document).ready(function () {
    $('.slider').slider();
    $(".button-collapse").sideNav();
    $('.modal').modal();
    
    // When click on savearticle button
    $(document).on('click', '.save-button', function () {
        var thisId = $(this).attr("id");
        var summary = $("#summary-" + thisId).text();
        var title = $("#title-" + thisId).text();
        var link = $("#link-" + thisId).attr('href');
        var byline = $("#byline-" + thisId).text();
        var data = {
            "id": thisId,
            "summary": summary,
            "title": title,
            "link": link,
            "byline": byline
        };
        console.log(data);
        $.ajax({
            type: "POST",
            url: "/save",
            data: data,
            dataType: "json",
            success: function (data, textStatus) {
                console.log(data);
            }
        });
    });

    // When click on deletearticle button
    $(document).on('click', '.delete-button', function () {
        var thisId = $(this).attr("id");
        var summary = $("#summary-" + thisId).text();
        var title = $("#title-" + thisId).text();
        var link = $("#link-" + thisId).attr('href');
        var byline = $("#byline-" + thisId).text();
        var data = {
            "id": thisId,
            "summary": summary,
            "title": title,
            "link": link,
            "byline": byline
        };
        console.log(data);
        $.ajax({
            type: "DELETE",
            url: "/delete",
            data: data,
            dataType: "json",
            success: function (data, textStatus) {
                console.log(data);
            }
        });
    });

// create note
    $(document).on("click", ".create-note", function () {
        /* $("#notes").empty();
        var thisId = $(this).attr("data-id");
        $.getJSON("/articles/" + thisId, function (data) {
            data = data[0];
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title'>");
            // A textarea to add a new note
            $("#notes").append("<textarea id='bodyinput' name='body></textarea>");
            $("#notes").append("<a id=''" + data._id + " id='savenote' class='waves-effect waves-light btn'>Save Note</a>");
    
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });*/
    });  

    // When you click the savenote button
    $(document).on("click", "#savenote", function () {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");
    
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    // Value taken from title input
                    title: $("#titleinput").val(),
                    // Value taken from note textarea
                    body: $("#bodyinput").val()
                }
            })
            // With that done
            .done(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
            });
    
        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });
});