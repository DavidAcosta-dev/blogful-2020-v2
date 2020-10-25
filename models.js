'use strict';

const mongoose = require("mongoose"); //importing mongoose

//this is our schema to represent a BlogPost
const blogPostSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: {
            firstName: String,
            lastName: String
        }
    }
);


// *********************************************NOTE IF BROKEN, REPLACE ARROW FUNCTION WITH ANONYMOUS "FUNCTION"
//create an easy to read version of the author property that combines first and last into a single String.
blogPostSchema.virtual("authorString").get(() => {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

//declare an instance method that spits back a version of the document that we want to display to end users.
blogPostSchema.methods.easyRead = () => {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.authorString //note how we are using the virtual to represent the author property instead of the raw document version.
    };
};


const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = { BlogPost };//export the models, we have just one in here so far.


















/**=============================================================== OLD MODELS.JS ============================================================ */
// const uuid = require('uuid');

// // This module provides volatile storage, using a `BlogPost`
// // model. We haven't learned about databases yet, so for now
// // we're using in-memory storage. This means each time the app stops, our storage
// // gets erased.

// // Don't worry too much about how BlogPost is implemented.
// // Our concern in this example is with how the API layer
// // is implemented, and getting it to use an existing model.


// function StorageException(message) {
//     this.message = message;
//     this.name = "StorageException";
// }

// const BlogPosts = {
//     create: function (title, content, author, publishDate) {
//         const post = {
//             id: uuid.v4(),
//             title: title,
//             content: content,
//             author: author,
//             publishDate: publishDate || Date.now()
//         };
//         this.posts.push(post);
//         return post;
//     },
//     get: function (id = null) {
//         // if id passed in, retrieve single post,
//         // otherwise send all posts.
//         if (id !== null) {
//             return this.posts.find(post => post.id === id);
//         }
//         // return posts sorted (descending) by
//         // publish date
//         return this.posts.sort(function (a, b) {
//             return b.publishDate - a.publishDate
//         });
//     },
//     delete: function (id) {
//         const postIndex = this.posts.findIndex(
//             post => post.id === id);
//         if (postIndex > -1) {
//             this.posts.splice(postIndex, 1);
//         }
//     },
//     update: function (updatedPost) {
//         const { id } = updatedPost;
//         const postIndex = this.posts.findIndex(post => post.id === updatedPost.id);
//         if (postIndex === -1) {
//             throw new StorageException(
//                 `Can't update item \`${id}\` because doesn't exist.`)
//         }
//         this.posts[postIndex] = Object.assign(
//             this.posts[postIndex], updatedPost);
//         return this.posts[postIndex];
//     }
// };

// function createBlogPostsModel() {
//     const storage = Object.create(BlogPosts);
//     storage.posts = [];
//     return storage;
// }


// module.exports = { BlogPosts: createBlogPostsModel() };