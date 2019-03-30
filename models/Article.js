var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    summary: {
        type: String,
        required: true
    }, 
    link: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    },
    dateAdded: {
        type: Date,
        default: Date.now()
    },
    photo: String,
    author: String
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
