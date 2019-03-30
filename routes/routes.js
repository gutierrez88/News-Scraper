var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

module.exports = function(app) {
    app.get("/scrape", function(req, res) {
    axios.get("http://www..com/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element) {
        var result = {};
        result.title = $(this)
            .children("a")
            .text();
        result.link = $(this)
            .children("a")
            .attr("href");

        db.Article.create(result)
            .then(function(dbArticle) {
            console.log(dbArticle);
            })
            .catch(function(err) {
            console.log(err);
            });
        });
        res.send("Scrape Complete");
    });
    });

    app.get("/articles", function(req, res) {
    db.Article.find({}).then(function (data){
        res.json(data);
    }).catch(function(error) {
        res.json(error);
    });
    });

    app.get("/articles/:id", function(req, res) {
    db.Article.find({_id: req.params.id})
    .populate("note")
    .then(function(data) {
        res.json(data);
    }).catch(function(error) {
        res.json(error);
    });
    });

    app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(newnote){
        return db.Article.findOneAndUpdate({_id: req.params.id},{ $push: {note: newnote._id}}, {new: true});
    })
    .then(function(data) {
        res.json(data);
    }).catch(function(error) {
        res.json(error);
    });
    });

};