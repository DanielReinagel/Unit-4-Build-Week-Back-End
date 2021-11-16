const model = require("./users-model");
const bcrypt = require("bcryptjs");

const signupPayload = (req, res, next) => {
  const { username, phoneNumber, password } = req.body;
  if(!username || !phoneNumber || !password) res.status(400).json({message: "You must include a username, phone number(phoneNumber), and password"});
  else if(typeof username !== "string" || typeof phoneNumber !== "string" || typeof password !== "string") res.status(400).json({message: "Your username, phone number(phoneNumber), and password must be of type string"});
  else model.getBy({ username })
    .then(users => {
      if(users.length) res.status(400).json({message:"username taken"});
      else {
        req.payload = { username, phoneNumber, password: bcrypt.hashSync(password, 8)};
        next();
      }
    })
}

const loginPayload = (req, res, next) => {
  const { username, password } = req.body;
  if(!username || !password) res.status(400).json({message: "You must include a username and password"});
  else if(typeof username !== "string" || typeof password !== "string") res.status(400).json({message: "Your username and password must be of type string"});
  else {
    req.payload = {username, password};
    next();
  }
}

const updatePayload = (req, res, next) => {
  const { phoneNumber, password } = req.body;
  const { id, username } = req.user;
  if(!phoneNumber||!password) res.status(400).json({message:"You must include a phoneNumber and password"});
  else if(typeof phoneNumber !== "string" || typeof password !== "string") res.status(400).json({message:"phoneNumber and password must be of type string"});
  else {
    req.payload = {id, username, phoneNumber, password: bcrypt.hashSync(password, 8)};
    next();
  }
}

module.exports = {
  signupPayload,
  loginPayload,
  updatePayload
};