$(document).ready(function () {
    $('.slider').slider();
    $(".button-collapse").sideNav();
});

function displayScrape() {
    $.getJSON("/all" ,function(data){
        console.log(data);
        $("#display-results").empty();
        for (var i = 0; i < data.length; i++) {
            var tr;
            tr = $("<tr/>");
            tr.append("<td>" + data[i].title + "</td>");
            tr.append("<td>" + data[i].link + "</td>");
            $("#display-results").first().append(tr);
        }
    });
}