function displayScrape() {
    $.getJSON("/all", function (data) {
        console.log(data);
        $("#fox5").empty();
        for (var i = 0; i < data.length; i++) {
            var mainDiv = $("<div>");
            mainDiv.addClass("card blue-grey darken-1");

            var cardContentDiv = $("<div>");
            cardContentDiv.addClass("card-content white-text");

            var spanTitle = $("<span>");
            spanTitle.addClass("card-title");
            spanTitle.text(data[i].title);
            var p = $("<p>");
            cardContentDiv.append(spanTitle);
            cardContentDiv.append(p);

            var cardActionDiv = $("<div>");
            cardActionDiv.addClass("card-action");
            var a = $("<a>");
            a.attr("href", data[i].link);
            a.text("Go to the article");
            cardActionDiv.append(a);

            var button = $("<a>");
            button.addClass("waves-effect waves-light btn");
            button.text("Create Notes");
            cardActionDiv.append(button);
            mainDiv.append(cardContentDiv);
            mainDiv.append(cardActionDiv);

            $("#fox5").append(mainDiv);

        }
    });
}

$(document).on("click","a",function(){
    $("#notes").empty();
    var thisId = $(this).attr("");

    $.ajax({
        method: "GET",
        url: "/articles" + thisId
    })
    .done(function(data){
        $("#notes").append("<h2>"+ data.title+ "</h2>");
        
    });
});
$(document).ready(function () {
    $('.slider').slider();
    $(".button-collapse").sideNav();
});