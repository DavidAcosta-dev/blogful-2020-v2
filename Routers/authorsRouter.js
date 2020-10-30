const express = require('express');
const router = express.Router();

const { Author } = require('../models');

router.get('/', (req, res) => {
    Author.find()
        .then(authors => {
            res.status(200);
            res.json({
                count: authors.length,
                authors
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error...whoops, sorry." });
        });
})//end of GET


module.exports = router;