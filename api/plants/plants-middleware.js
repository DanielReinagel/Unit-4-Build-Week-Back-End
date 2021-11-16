const jwt = require("jsonwebtoken");
const secret = require("../secret");
const usersModel = require("../users/users-model");

const verifyUser = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token) res.status(401).json({message: "Token required"});
  else {
    jwt.verify(token, secret, (err, decoded) => {
      if(err) res.status(401).json({message: "Token invalid"});
      else {
        usersModel.getBy({username:decoded.subject}).first().then(user => {
          if(!user) res.status(401).json({message:"Token invalid"});
          else {
            req.user_id = user.id;
            req.user = user;
            next();
          }
        }).catch(err => res.status(500).json({message:err.message, stack:err.stack, where:"getting user"}))
      }
    })
  }
};

const insertPayload = (req, res, next) => {

}

module.exports = {
  verifyUser
};