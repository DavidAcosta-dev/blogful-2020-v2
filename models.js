'use strict';

const mongoose = require("mongoose"); //importing mongoose


//declare the authorSchema
const authorSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true }
});

const commentSchema = mongoose.Schema({ content: 'string' });//declare the commentSchema before blogPostSchema

//this is our schema to represent a BlogPost.
//NOTE:comments property is a subdocument referencing commentSchema
const blogPostSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' }, //points to a specific author id (ehich is a mongo ObjectId _id), the ref is pointing to/referencing the 'Author' model we declared below which uses the authorSchema. The 'Author' model declaration below of course points to the "authors" db collection in it's 3rd argument.
        comments: [commentSchema],
        created: { type: Date, default: Date.now }
    }
);

//use a pre-hook when using BlogPost.findOne to populate the 'author' key on the blogPost object, activating the reference we defined in the blogPostSchema.
blogPostSchema.pre(['find', 'findOne'], function (next) {
    this.populate('author');
    next();
});

// blogPostSchema.pre('findOne', function (next) { //could just use an array with mulitple prehook arguments
//     this.populate('author');
//     next();
// });



// *********************************************!!!!!!!NOTE: DO NOT use ARROW FUNCTION , only use ANONYMOUS "FUNCTION"
//create an easy to read version of the author property that combines first and last into a single String.
blogPostSchema.virtual("authorName").get(function () {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

//declare an instance method that spits back a version of the document that we want to display to end users.
blogPostSchema.methods.easyRead = function () {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.authorName, //note how we are using the virtual to represent the author property instead of the raw document version.
        comments: this.comments,
        created: this.created,
    };
};



const BlogPost = mongoose.model("BlogPost", blogPostSchema, 'blogPosts');
const Author = mongoose.model("Author", authorSchema, 'authors');//creating model named Author, uses the 'authorSchema', and points to 'authors' db collection

module.exports = { BlogPost, Author };//export the models

