const express = require('express');
const router = express.Router();

const { BlogPost } = require('../models');

router.get('/', (req, res) => {
    const filters = {};
    const queryableFields = ['title', 'author'];
    queryableFields.forEach(field => {
        if (req.query[field]) {
            filters[field] = req.query[field];
        }
    });//end of queryableFields.forEach()
    BlogPost.find(filters)
        .then(blogs => {
            res.json({
                count: blogs.length,
                blogs: blogs.map(blog => blog.easyRead()) //NEED TO FIX THE instance method here!!!!!!!
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
});//end of GET/


//GET by ID using mongoose's convinience method for finding by id
router.get('/:id', (req, res) => {
    BlogPost
        .findById(req.params.id)
        .then(blog => res.json(blog.easyRead()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
});


router.post('/', (req, res) => {
    console.log(req.body);
    const requiredFields = ['title', 'content', 'author'];
    const missingFields = [];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!Object.keys(req.body).includes(requiredFields[i])) {
            missingFields.push(requiredFields[i])
            console.log(`missing a field: ${requiredFields[i]}`);
        }
    };
    missingFields.length > 0 ? res.status(400).send(`Please check your Blog post object. Missing following fields: ${missingFields}`) : null;
    const { title, author, content } = req.body;
    BlogPost.create({
        title,
        content,
        author
    })
        .then(blog => res.status(201).json(blog.easyRead()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
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
        .findByIdAndUpdate(req.params.id, { $set: toUpdate })
        .then(blog => res.status(204).end())
        .catch(err => res.status(500).json({ message: "Internal server error" }));
});//end of put


router.delete('/:id', (req, res) => {
    console.log(req.params.id);
    BlogPost.findByIdAndDelete(req.params.id)
        .then(blog => res.status(204).end())
        .catch(err => res.status(500).json({ message: "Internal server error" }));
})//end of delete


module.exports = router;