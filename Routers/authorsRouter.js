const express = require('express');
const router = express.Router();

const { Author, BlogPost } = require('../models');

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


router.post('/', (req, res) => {
    //field validation
    const requiredFields = ['firstName', 'lastName', 'userName'];
    const missingFields = [];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!(req.body[requiredFields[i]])) {
            missingFields.push(requiredFields[i]);
            console.log(`missing field: ${requiredFields[i]}`)
        }
    }
    console.log(missingFields)
    if (missingFields.length > 0) {
        const message = `Looks like your missing the required fields to post: ${missingFields}`;
        console.error(message);
        return res.status(400).send(message);
    };

    Author
        .findOne({ userName: req.body.userName })
        .then(author => {
            if (author) {
                const message = `Whoops, looks like username "${req.body.userName}" is already taken.\n Please use a different username.`;
                console.error(message);
                return res.status(400).send(message);
            }
            else {//if userName is not already taken, Author.create(newUser)
                Author
                    .create({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        userName: req.body.userName
                    })
                    .then(author => {
                        res.status(201).json(author);
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ error: `Something went wrong with the Author.create() \n details: ${err} ` });
                        res.end();
                    });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: `Something went wrong with the Author.create() \n details: ${err} ` });
            res.end();
        });
});//end of POST


router.put('/:id', (req, res) => {
    if (!(req.params.id || req.body.id) || (req.params.id !== req.body.id)) {
        const message = `Please check that your id in the url matches the id in the request body.`;
        console.error(message);
        res.status(400).json({ error: message });
        res.end();
    }

    const updated = {};
    const updateableFields = ['firstName', 'lastName', 'userName'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });
    console.log(updated);

    Author
        .findOne({ userName: updated.userName || '', _id: { $ne: req.params.id } })
        .then(author => {
            if (author) {
                const message = `Whoops, looks like ${updated.userName} is already taken`;
                console.error(message);
                return res.status(400).send(message);
            }
            else {
                Author
                    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true }) //id, updated object, and the 3rd arg is whether or not you want to use the updated version of this method or the deprecated version.
                    .then(updatedAuthor => {
                        res.status(200).json({
                            id: updatedAuthor.id,
                            name: `${updatedAuthor.firstName} ${updatedAuthor.lastName}`,
                            userName: updatedAuthor.userName
                        });
                    })
                    .catch(err => {
                        const message = 'Something went wrong here';
                        console.error(err);
                        res.status(500).json({ message, error: err });
                    });
            }
        })
        .catch(err => {
            const message = 'Something went wrong here';
            console.error(err);
            res.status(500).json({ message, error: err });
        });
});//end of PUT


router.delete('/:id', (req, res) => {
    BlogPost
        .remove({ author: req.params.id })
        .then(() => {
            Author
                .findByIdAndRemove(req.params.id)
                .then(() => {
                    const message = `Deleted author with id of ${req.params.id}.\n Deleted all blog posts by author with id: ${req.params.id}.`;
                    console.log(message);
                    return res.status(204).json({ message: `[success] ${message}` });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
});//end of DELETE


module.exports = router;