const express = require('express');
const db = require('../data/helpers/userDb');

//Initialize router object
const router = express.Router();

router.get('/', (req, res) => {
    db.get()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(500).send({
                error: "The users information could not be retrieved."
            })
        });
});

router.post('/', (req, res) => {
    if (req.body.name === undefined) {
        res.status(400).send({
            error: "Please provide name for the user."
        });
    } else {
        db.insert({
                name: req.body.name
            })
            .then(response => {

                return db.getById(response.id);
            })
            .then(response => {
                res.status(201).send({
                    data: response
                });
            })
            .catch(error => {
                res.status(500).send({
                    error: "There was an error while saving the user to the database"
                });
            });
    }
});

router.get('/:id', (req, res) => {
    db.getById(req.params.id)
        .then(response => {
            if (response.length === 0) {
                res.status(404).send({
                    error: "The user with the specified ID does not exist."
                });
            } else {
                res.status(200).send({
                    data: response
                });
            }
        })
        .catch(error => {
            res.status(500).send({
                error: "The user information could not be retrieved."
            })
        });
});

router.get('/:id/posts', (req, res) => {
    db.getUserPosts(req.params.id)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(500).send({
                error: "The posts information could not be retrieved."
            })
        });
});

router.put('/:id', (req, res) => {

    let userEditing;

    db.getById(req.params.id)
        .then((response) => {
            if (response === undefined) {
                res.status(404).send({
                    error: "The user with the specified ID does not exist."
                });
            } else if (req.body.name === undefined) {
                res.status(400).send({
                    error: "Please provide name for the user."
                });
            } else {
                userEditing = response;
                return db.update(req.params.id, {
                    name: req.body.name,
                    bio: req.body.bio
                });
            }
        })
        .then(response => {
            return db.getById(userEditing.id);
        })
        .then(response => {
            res.status(200).send({
                data: response
            });
        })
        .catch(error => {
            res.status(500).send({
                error: "The user information could not be modified."
            })
        });
});

router.delete('/:id', (req, res) => {

    let userDeleted;

    db.getById(req.params.id)
        .then((response) => {
            if (response.length === 0) {
                res.status(404).send({
                    error: "The user with the specified ID does not exist."
                });
            } else {
                userDeleted = response;
                return db.remove(req.params.id);
            }
        })
        .then(response => {
            res.status(200).send({
                data: userDeleted
            });
        })
        .catch(error => {
            res.status(500).send({
                error: "The user could not be removed."
            });
        });
});

module.exports = router;