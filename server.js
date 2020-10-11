//imports
const express = require('express');
const morgan = require('morgan');

//initailize express app
const app = express();

const blogpostsRouter = require('./Routers/blogpostsRouter');


app.use(morgan('common'));
app.use(express.json());//parse incoming json

//static file sharing
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

//using express router as middleware
app.use('/blog-posts', blogpostsRouter);

let server;

const runServer = () => {

    const port = process.env.PORT || 8080;

    return new Promise((resolve, reject) => {
        server = app
            .listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve(server);
            })
            .on('error', err => {
                console.log(`Something went arry, here's the error: ${err}`)
                reject(err);
            });
    });// end of Promise
};


const closeServer = () => {
    return new Promise((resolve, reject) => {
        console.log('CLOSING SERVER');
        server.close(err => {
            if (err) {
                console.log('Error with closing the server, here is the error:', err);
                reject(err);
                return;
            };
            resolve(); //if no err, resolve
        });
    });//end of new Promise
};

//will only run by itslef runServer() if it's being called normally. but NOT if it's being called from a test.
if (require.main === module) {
    runServer()
        .catch(err => console.error(err));
}


module.exports = { app, runServer, closeServer };