//imports
const express = require('express');
const morgan = require('morgan');
const { BlogPosts } = require('./models');

//initailize express app
const app = express();

app.use(morgan('common'));
app.use(express.json());//parse incoming json

//static file sharing
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

//add volitile data to view and work with.
const blogs = [
    { title: "How to express app", content: "blahhhh balhhhhh", author: "Bonk the troll" },
    { title: "Bee and Puppycat moves to Netflix!", content: "The awesome show is now on Netflix! YEAHH het a GUM!!", author: "Bee the spaceperson" },
    { title: "Funnylying", content: "It's lying but they KNOW it's lying so it's funny. Funny lying...hehe get it?..", author: "Puppycat/Space Outlaw" }
]
//declaring a function that maps over blogs array to make some volitile data
const makeSomePosts = (blogs) => blogs.map(b => BlogPosts.create(b.title, b.content, b.author));

makeSomePosts(blogs);//calling function we made.

app.get('/blog-posts', (req, res) => {
    res.status(200).json(BlogPosts.get());
});

app.post('/blog-posts', (req, res) => {
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
    BlogPosts.create(title, content, author);
    res.status(201).send(`Awesome, we posted your object!`);
});// end of post

app.put('/blog-posts/:id', (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
    const requiredFields = ["title", "content", "author", "id"];
    const missingFields = [];

    if (req.params.id !== req.body.id) {
        res.status(400).send(`Please check that you have entered a valid blogpost id in the url OR that bot the updating object and url ids match.`);
    }

    for (i = 0; i < requiredFields.length; i++) {
        if (!Object.keys(req.body).includes(requiredFields[i])) {
            missingFields.push(requiredFields[i])
            console.log(`missing a field: ${requiredFields[i]}`);
        }
    };
    missingFields.length > 0 ? res.status(400).send(`Please check your Blog post object. Missing following fields: ${missingFields}`) : null;

    BlogPosts.update(req.body);
    res.status(202).send('We have successfully updated your object!');
});//end of put

app.delete('/blog-posts/:id', (req, res) => {
    console.log(req.params.id);
    BlogPosts.delete(req.params.id);
    res.status(204).send(`deleted post with id of ${req.params.id}`);
})//end of delete





app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});