const express = require('express');

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
    res.status(200).json(`I'm WORKING!!!! Server is working hard or hardly working!`);
})

module.exports = server;