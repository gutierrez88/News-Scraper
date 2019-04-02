$(document).ready(function(){
    $('.modal').modal();
});

var dataArray;

$(document).on("click", "#scrape", function(){
    $.ajax({
        url: "/scrape",
        type: "GET"
    }).then(function(data){
        console.log(data);
        $("#article-list").empty();
        for(var i = 0; i < data.length; i++){
        var newOne = "<li class='list-group-item row'><div class='center-align col s3 picture'><img src='"+ data[i].photo +"'></div><div class='col s8'><h5>"+ data[i].userName+"</h5><p>"+ data[i].summary +"</p><p>By "+ data[i].author +"</p><a href=''"+ data[i].url +"' class='btn btn-primary'>Full Article</a><button type='button' class='btn btn-danger' data-id='"+ data[i]._id +"' data-sum='"+ data[i].userName +" data-toggle='modal' id='seeNote'>See Note</button><button type='button' class='btn btn-danger' data-id='"+ data[i]._id +"' data-sum='"+ data[i].userName +"' id='writeNote'>Write Note</button></div></li><hr>"

        $("#article-list").prepend(newOne);
        };
    })
})

$(document).on("click", "#writeNote", function(){
    var sum =$(this).attr("data-sum");
    var thisId = $(this).attr("data-id");
    $("#addNote").attr("data-id", thisId);
    $("#modalUserName").text(sum); 

    $("#notesModal").modal('open')
})

$(document).on("click", "#addNote", function() {
    $("#notesModal").modal('close')
    
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
    }).then(function(data) {
        console.log(data);
    });

    $("#noteTitle").val("");
    $("#noteBody").val("");
  });

  $(document).on("click", "#seeNote", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/note/" + thisId
    }).then(function(data){
        console.log(data);
        $("#modalNotes-content").empty();
        // for (i = 0; i < data.notes.length; i++){
            var notes = "<div id='singleNote' class='text-center'><h6>"+ data[0].notes.title +"</h6><h6>"+ data[0].notes.body +"</h6><button class='btn' id='deleteNote' data-id='"+ data[0]._id +"'>Delete</button><a href='#!' class='modal-close waves-effect waves-green btn-flat'>Close</a></div>"

            $("#modalNotes-content").append(notes);
        

        $("#seeModal").modal('open')
    });
    
    
  });