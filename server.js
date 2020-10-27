//imports
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

//mongoose internally uses a "promise-like" object,
//but it's better to have Mongoose use built-in es6 promises.
mongoose.Promise = global.Promise;

//import constants for env vars
const { PORT, DATABASE_URL } = require('./config');

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

// catch-all endpoint if client makes request to non-existent endpoint
app.use("*", function (req, res) {
    res.status(404).json({ message: "Not Found" });
});

let server;

const runServer = (databaseUrl, port = PORT) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app
                .listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve(server);
                })
                .on('error', err => {
                    console.log(`Something went arry, here's the error: ${err}`)
                    mongoose.disconnect();
                    reject(err);
                });
        })//end of mongoose.connect()
    });// end of new Promise
};//end of runServer()


const closeServer = () => {
    return mongoose.disconnect().then(() => {
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
    })//end of .then()
};//end of closeServer()

//will only run by itslef runServer() if it's being called normally. but NOT if it's being called from a test.
if (require.main === module) {
    runServer(DATABASE_URL)
        .catch(err => console.error(err));
}


module.exports = { app, runServer, closeServer };