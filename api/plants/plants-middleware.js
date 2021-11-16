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
  const { nickname, species, h2oFrequency, imageURL:imageUrl } = req.body;
  let imageURL;
  const user_id = req.user_id;
  if(!nickname || !species || !h2oFrequency) res.status(400).json({message: "You must include a nickname, species, and h2oFrequency"});
  else if(typeof nickname !== "string" || typeof species !== "string" || typeof h2oFrequency !== "string") res.status(400).json({message: "nickname, species, and h2oFrequency must be of type string"});
  else {
    if(!imageUrl || typeof imageUrl !== "string") imageURL = null; else imageURL = imageUrl;
    req.payload = {nickname, species, h2oFrequency, imageURL, user_id};
    next();
  }
}

module.exports = {
  verifyUser,
  insertPayload
};