$(document).ready(function () {
    $('.modal').modal();
});

$(document).on("click", ".scrape", function(e) {
    e.preventDefault();

    console.log("11")
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function (data) {
        console.log(data);
        $("#article-list").empty();
        for (var i = 0; i < data.length; i++) {
            var newOne = "<li class='list-group-item row'><div class='center-align col s3 picture'><img src='" + data[i].photo + "'></div><div class='col s8'><h5>" + data[i].userName + "</h5><p>" + data[i].summary + "</p><p>By " + data[i].author + "</p><a href=''" + data[i].url + "' class='btn btn-primary'>Full Article</a><button type='button' class='btn btn-danger' data-id='" + data[i]._id + "'  id='saveArticle'>Save Article</button></div></li><hr>"

            $("#article-list").prepend(newOne);
        };
    })
})

$(document).on("click", "#savedArticles", function(e) {
    e.preventDefault();

    console.log("12")
    $.ajax({
        method: "GET",
        url: "/saved"
    }).then(function (data) {
        console.log(data);
        $("#article-list").empty();
        for (var i = 0; i < data.length; i++) {
            var newOne = "<li class='list-group-item row'><div class='center-align col s3 picture'><img src='" + data[i].photo + "'></div><div class='col s8'><h5>" + data[i].userName + "</h5><p>" + data[i].summary + "</p><p>By " + data[i].author + "</p><a href=''" + data[i].url + "' class='btn btn-primary'>Full Article</a><button type='button' class='btn btn-danger' data-id='" + data[i]._id + "' data-sum='" + data[i].userName + " data-toggle='modal' id='seeNote'>See Note</button><button type='button' class='btn btn-danger' data-id='" + data[i]._id + "' data-sum='" + data[i].userName + "' id='writeNote'>Write Note</button><button class='btn btn-danger' data-id='" + data[i]._id + "'  id='deleteArticle'>Remove Article</button></div></li><hr>"

            $("#article-list").prepend(newOne);
        };
    })
})

$(document).on("click", "#writeNote", function(e) {
    e.preventDefault();
    console.log("13")
    var sum = $(this).attr("data-sum");
    var thisId = $(this).attr("data-id");
    $("#addNote").attr("data-id", thisId);
    $("#modalUserName").text(sum);

    $("#notesModal").modal('open')
})

$(document).on("click", "#addNote", function(e) {
    e.preventDefault();
    $("#notesModal").modal('close')
    console.log("14")
    var thisId = $(this).attr("data-id");
    var title = $("#noteTitle").val();
    var body = $("#noteBody").val();

    $.ajax({
        method: "POST",
        url: "/note/" + thisId,
        data: {
            title: title,
            body: body
        }
    }).then(function (data) {
        console.log(data);
    });

    $("#noteTitle").val("");
    $("#noteBody").val("");
});

$(document).on("click", "#saveArticle", function(e) {
    e.preventDefault();
    var thisId = $(this).attr("data-id");
    console.log("15")
    $.ajax({
        method: "POST",
        url: "/saveArticle/" + thisId,
        data: {
            saved: "true"
        }
    }).then(function (data) {
        $("#saved").modal('open')
    });
});

$(document).on("click", "#deleteArticle", function(e) {
    e.preventDefault();
    var thisId = $(this).attr("data-id");
    console.log("16")
    $.ajax({
        method: "POST",
        url: "/removeArticle/" + thisId,
        data: {
            saved: "false"
        }
    }).then(function (data) {
        console.log(data);
        $("#article-list").empty();
        for (var i = 0; i < data.length; i++) {
            if (data[0].notes[i].saved == "false"){
                console.log("note deleted")
            }else{
                var newOne = "<li class='list-group-item row'><div class='center-align col s3 picture'><img src='" + data[i].photo + "'></div><div class='col s8'><h5>" + data[i].userName + "</h5><p>" + data[i].summary + "</p><p>By " + data[i].author + "</p><a href=''" + data[i].url + "' class='btn btn-primary'>Full Article</a><button type='button' class='btn btn-danger' data-id='" + data[i]._id + "' data-sum='" + data[i].userName + " data-toggle='modal' id='seeNote'>See Note</button><button type='button' class='btn btn-danger' data-id='" + data[i]._id + "' data-sum='" + data[i].userName + "' id='writeNote'>Write Note</button><button class='btn btn-danger' data-id='" + data[i]._id + "'  id='deleteArticle'>Remove Article</button></div></li><hr>"

                $("#article-list").prepend(newOne);
            };
        };
    });
});

$(document).on("click", "#seeNote", function(e) {
    e.preventDefault();
    var thisId = $(this).attr("data-id");
    console.log("17")
    $.ajax({
        method: "GET",
        url: "/note/" + thisId
    }).then(function (data) {
        console.log(data);
        $("#modalNotes-content").empty();
        for (i = 0; i < data[0].notes.length; i++){
            if ( data[0].notes[i].saved == "false"){
                console.log("deleted")
            }else{
                var notes = "<div id='singleNote' class='text-center'><h6>" + data[0].notes[i].title + "</h6><h6>" + data[0].notes[i].body + "</h6><button class='btn' id='deleteNote' data-noteId='"+ data[0].notes[i]._id +"' data-id='" + data[0]._id + "'>Delete</button></div>"

                $("#modalNotes-content").append(notes);
            }
        }


        $("#seeModal").modal('open')
    });
});

$(document).on("click", "#deleteNote", function(e) {
    e.preventDefault();
    var thisId = $(this).attr("data-noteId");
    $("#seeModal").modal('close')
    console.log("16")
    $.ajax({
        method: "POST",
        url: "/deleteNote/" + thisId,
        data: {
            saved: "false"
        }
    }).then(function (data) {
        console.log(data);
        $("#seeModal").empty();

    //     for (i = 0; i < data[0].notes.length; i++){
    //         var notes = "<div id='singleNote' class='text-center'><h6>" + data[0].notes[i].title + "</h6><h6>" + data[0].notes[i].body + "</h6><button class='btn' id='deleteNote' data-noteId='"+ data[0].notes[i]._id +"' data-id='" + data[0]._id + "'>Delete</button></div>"

    //         $("#modalNotes-content").append(notes);
    //     }
    // });
    $("#deleted").modal('open')
    });
});