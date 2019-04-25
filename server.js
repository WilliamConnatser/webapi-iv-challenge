const express = require('express');
const server = express();
const postRouter = require('./controllers/posts');
const userRouter = require('./controllers/users');

server.use(express.json());
server.use(capitalizedNames);

function capitalizedNames (req, res, next) {
    if(req.body.name !== undefined)
        req.body.name =req.body.name.toUpperCase();

    next();
}

server.get('/', (req, res) => {
    res.send('Sanity check');
});

server.use('/api/posts',postRouter);
server.use('/api/users',userRouter);

module.exports = server;