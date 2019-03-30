var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function(app) {


    app.get("/", function(req, res) {
    axios.get("https://www.nytimes.com/section/sports").then(function(response) {
        var $ = cheerio.load(response.data);

        $(".css-1cp3ece").each(function(i, element) {
        var result = {};
        result.username = $(this).find(".css-4jyr1y").find("h2").text();;
        result.link = $(this).find(".css-4jyr1y").children("a").attr("href");
        result.summary = $(this).find(".css-4jyr1y").find("p").text();
        result.photo = $(this).find(".css-4jyr1y").find("img").attr("src");
        result.author = $(this).find(".css-4jyr1y").find(".css-1n7hynb").text();

        console.log(result);

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