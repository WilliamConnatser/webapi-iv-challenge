const express = require('express');
const db = require('../data/helpers/postDb');

//Initialize router object
const router = express.Router();


router.get('/', (req, res) => {
    db.get()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(500).send({
                error: "The posts information could not be retrieved."
            })
        });
});

router.post('/', (req, res) => {
    if (req.body.text === undefined || req.body.user_id === undefined) {
        res.status(400).send({
            error: "Please provide text and a user_id for the post."
        });
    } else {
        db.insert({
                text: req.body.text,
                user_id: req.body.user_id
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
                    error: "There was an error while saving the post to the database"
                });
            });
    }
});

router.get('/:id', (req, res) => {
    db.getById(req.params.id)
        .then(response => {
            if (response.length === 0) {
                res.status(404).send({
                    error: "The post with the specified ID does not exist."
                });
            } else {
                res.status(200).send({
                    data: response
                });
            }
        })
        .catch(error => {
            res.status(500).send({
                error: "The post information could not be retrieved."
            })
        });
});

router.put('/:id', (req, res) => {

    let postEditing;

    db.getById(req.params.id)
        .then((response) => {
            if (response === undefined) {
                res.status(404).send({
                    error: "The post with the specified ID does not exist."
                });
            } else if (req.body.text === undefined || req.body.user_id === undefined) {
                res.status(400).send({
                    error: "Please provide text and a user_id for the post."
                });
            } else {
                postEditing = response;
                return db.update(req.params.id, {
                    text: req.body.text,
                    user_id: req.body.user_id
                });
            }
        })
        .then(response => {
            return db.getById(postEditing.id);
        })
        .then(response => {
            res.status(200).send({
                data: response
            });
        })
        .catch(error => {
            console.log(error)
            res.status(500).send({
                error: "The post information could not be modified."
            })
        });
});

router.delete('/:id', (req, res) => {

    let postDeleted;

    db.getById(req.params.id)
        .then((response) => {
            if (response.length === 0) {
                res.status(404).send({
                    error: "The post with the specified ID does not exist."
                });
            } else {
                postDeleted = response;
                return db.remove(req.params.id);
            }
        })
        .then(response => {
            res.status(200).send({
                data: postDeleted
            });
        })
        .catch(error => {
            res.status(500).send({
                error: "The post could not be removed."
            });
        });
});

module.exports = router;