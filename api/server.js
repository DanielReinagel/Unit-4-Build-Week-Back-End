const express = require('express')
const helmet = require('helmet')
const cors = require('cors');
const usersRouter = require('./users/users-router');

const server = express()
server.use(express.json())
server.use(helmet())
server.use(cors())

server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.status(200).json({message: "api is up"});
})

server.use((req, res) => res.status(404).json({message:"Resource not found", method:req.method, path:req.url}));

module.exports = server
