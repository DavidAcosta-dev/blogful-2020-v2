const express = require('express');
const router = express.Router();

const { BlogPost, Author } = require('../models');

router.get('/', (req, res) => {
    const filters = {};
    const queryableFields = ['title', 'author']; //you can query by author by querying the author id# or title by using the blog title ...for example:       http://localhost:8080/blog-posts/?author=5af50c84c082f1e92f834209
    queryableFields.forEach(field => {
        if (req.query[field]) {
            filters[field] = req.query[field];
        }
    });//end of queryableFields.forEach()
    BlogPost.find(filters)
        .then(blogs => {
            console.log(blogs);
            res.json({
                count: blogs.length,
                blogs: blogs.map(blog => {
                    return {
                        id: blog._id,
                        title: blog.title,
                        author: blog.authorName, //using virtual here
                        content: blog.content,
                        comments: blogs.length <= 3 ? blog.comments : "..." //if the results are more than 3, just show "..." for comments, else show all comments
                    }
                })
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Something's gone awry, it's on our end for sure." });
        });
});//end of GET/


//GET by ID using mongoose's convinience method for finding by id
router.get('/:id', (req, res) => {
    BlogPost
        .findById(req.params.id)
        .then(blog => res.json(blog.easyRead()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error, on our end, appologies" });
        });
});



/*To post you must include an object in the request body in the following json format:
{
    "title": "Temp jobs are kinda interesting",
    "author_id": "5af50c84c082f1e92f83420a", //important: need the author's id
    "content": "Blahh blahh. The blahhh blaa thing that bllaahhhhh in the blahhh blahhhh forest and blaah lake blahhh"
}
*/
router.post('/', (req, res) => {
    console.log(req.body);
    const requiredFields = ['title', 'content', 'author_id'];
    const missingFields = [];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!Object.keys(req.body).includes(requiredFields[i])) {
            missingFields.push(requiredFields[i])
            console.log(`missing a field: ${requiredFields[i]}`);
        }
    };
    missingFields.length > 0 ? res.status(400).send(`Please check your Blog post object. Missing following fields: ${missingFields}`) : null;
    const { title, author_id, content } = req.body;

    //Checkif the author exists
    Author.findById(author_id)//passing the ObjectId found in the post request body's "author" field and using it to query through the author collection
        .then(auth => {
            if (auth) { //if the author exists, then we BlogPost.create(newpost)
                return BlogPost.create({
                    title,
                    content,
                    author: author_id
                })
                    .then(blog => res.status(201).json(blog.easyRead())) //the prehook that populates author only runs on find() and findOne() so since we are just returning the json manually the author portion of this returned json will be undefined which is fine since the actual one in the database will reflect correctly when we fetch it.
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ message: "Internal server error" });
                    });
            } else {
                const message = `Author not found`;
                console.error(message);
                return res.status(400).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something has gone awry' });
        });
});// end of post/


router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message =
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`;
        console.error(message);
        return res.status(400).json({ message: message });
    }
    const toUpdate = {};
    const updateableFields = ["title", "author", "content"];
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    BlogPost
        .findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
        .then(updatedBlog => res.status(200).json({
            id: updatedBlog.id,
            title: updatedBlog.title,
            content: updatedBlog.content
        }))
        .catch(err => res.status(500).json({ message: "Internal server error" }));
});//end of put


router.delete('/:id', (req, res) => {
    console.log(req.params.id);
    BlogPost.findByIdAndDelete(req.params.id)
        .then(blog => res.status(204).end())
        .catch(err => res.status(500).json({ message: "Internal server error" }));
})//end of delete


module.exports = router;