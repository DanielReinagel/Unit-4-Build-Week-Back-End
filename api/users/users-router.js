const router = require("express").Router();
const model = require("./users-model");
const jwt = require("jsonwebtoken");
const secret = require("../secret");
const bcrypt = require("bcryptjs");
const { signupPayload, loginPayload } = require("./users-middleware");

router.post("/login", loginPayload, (req, res) => {
  const { username, password } = req.payload;
  model.getBy({ username })
    .then(users => {
      if(!users.length || !bcrypt.compareSync(password, users[0].password)) res.status(400).json({message: "Invalid username or password"});
      else {
        const token = jwt.sign({subject: username}, secret, {expiresIn:"1d"});
        res.status(200).json({message:`Welcome ${username}`, token});
      }
    }).catch(err => res.status(500).json({where:"getting user", message:err.message, stack:err.stack}));

})

router.post("/signup", signupPayload, (req, res) => {
  model.insert(req.payload)
    .then(user => {
      const token = jwt.sign({subject: user.username}, secret, {expiresIn:"1d"});
      res.status(201).json({message:`Welcome to your new account ${user.username}`, token});
    }).catch(err => res.status(500).json({where:"adding user", message:err.message, stack:err.stack}));
})

module.exports = router;