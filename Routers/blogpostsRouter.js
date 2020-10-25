const express = require('express');
const router = express.Router();

const { BlogPosts } = require('../models');


//add volitile data to view and work with.
const blogs = [
    { title: "How to express app", content: "blahhhh balhhhhh", author: { firstName: "Bonk", lastName: "The Troll" } },
    { title: "Bee and Puppycat moves to Netflix!", content: "The awesome show is now on Netflix! YEAHH het a GUM!!", author: "Bee the spaceperson" },
    { title: "Funnylying", content: "It's lying but they KNOW it's lying so it's funny. Funny lying...hehe get it?..", author: "Puppycat/Space Outlaw" }
]
//declaring a function that maps over blogs array to make some volitile data
const makeSomePosts = (blogs) => blogs.map(b => BlogPosts.create(b.title, b.content, b.author));

makeSomePosts(blogs);//calling function we made.

router.get('/', (req, res) => {
    res.status(200).json(BlogPosts.get());
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
    }

    missingFields.length > 0 ? res.status(400).send(`Please check your Blog post object. Missing following fields: ${missingFields}`) : null;
    const { title, author, content } = req.body;
    res.status(201).json(BlogPosts.create(title, content, author));
});// end of post

router.put('/:id', (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    const requiredFields = ["title", "content", "author", "id"];
    const missingFields = [];

    if (req.params.id !== req.body.id) {
        res.status(400).send(`Please check that you have entered a valid blogpost id in the url OR that both the updating object and url ids match.`);
    }

    for (i = 0; i < requiredFields.length; i++) {
        if (!Object.keys(req.body).includes(requiredFields[i])) {
            missingFields.push(requiredFields[i])
            console.log(`missing a field: ${requiredFields[i]}`);
        }
    };
    missingFields.length > 0 ? res.status(400).send(`Please check your Blog post object. Missing following fields: ${missingFields}`) : null;


    res.status(200).json(BlogPosts.update(req.body));
});//end of put

router.delete('/:id', (req, res) => {
    console.log(req.params.id);
    BlogPosts.delete(req.params.id);
    console.log(`DELETED blog post with id of ----> ${req.params.id}`);
    res.status(204).end();
})//end of delete


module.exports = router;