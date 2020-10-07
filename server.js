//imports
const express = require('express');
const morgan = require('morgan');

const blogpostsRouter = require('./Routers/blogpostsRouter');

//initailize express app
const app = express();

app.use(morgan('common'));
app.use(express.json());//parse incoming json

//static file sharing
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

//using express router as middleware
app.use('/blog-posts', blogpostsRouter);


app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});