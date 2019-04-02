var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        db.Article.find({}).sort({_id: -1}).then(function (data){
            res.render("index",{
                content: data
            });
        }).catch(function(error) {
            res.render("404");
            res.json(error);
        });
        
    });

    app.get("/scrape", function(req, res) {
        
        axios.get("https://www.cnet.com/news/").then(function(response) {
            var $ = cheerio.load(response.data);
            
            $(".riverPost").each(function(i, element) {
                var result = {};
                result.userName = $(this).find("h3").children("a").text();
                result.url = "https://www.cnet.com" + $(this).find("h3").children("a").attr("href");
                result.summary = $(this).find("p").children("a").text();
                result.photo = $(this).find(".lazy").attr("data-original");
                result.author = $(this).find(".assetAuthor").children("a").text();
                

                db.Article.create(result)
                .then(function(data) {
                    res.redirect("/article");
                })
                .catch(function(error) {
                    console.log(error);
                })
                
            })
        })
    });

    app.get("/article", function(req, res) {
        db.Article.find({}).sort({_id: -1}).then(function (data){
            res.json(data);
        }).catch(function(error) {
            res.render("404");
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

    app.post("/note/:id", function(req, res) {
        db.Note.create(req.body)
        .then(function(newNote){
            return db.Article.findOneAndUpdate({_id: req.params.id},{ $push: {note: newNote._id}}, {new: true});
        })
        .then(function(data) {
            res.json(data);
        }).catch(function(error) {
            res.json(error);
        });
    });

};