const jwt = require("jsonwebtoken");
const secret = require("../secret");
const usersModel = require("../users/users-model");
const plantsModel = require("./plants-model");

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
};

const updatePayload = (req, res, next) => {
  const { id, nickname, species, h2oFrequency, imageURL:imageUrl } = req.body;
  const user_id = req.user_id;
  let imageURL;
  if(!id || !nickname || !species || !h2oFrequency) res.status(400).json({message: "You must include an id, nickname, species, and h2oFrequency"});
  else if(typeof id !== "number" || typeof nickname !== "string" || typeof species !== "string" || typeof h2oFrequency !== "string") res.status(400).json({message: "nickname, species, and h2oFrequency must be of type string and id must be of type number"});
  else {
    plantsModel.getById(id).then(plant => {
      if(!plant) res.status(400).json({message: `plant of id ${id} does not exist`});
      else if(plant.user_id !== user_id) res.status(401).json({message: "You may not edit this plant as it is not your plant"});
      else {
        if(!imageUrl || typeof imageUrl !== "string") imageURL = null; else imageURL = imageUrl;
        req.payload = {id, nickname, species, h2oFrequency, imageURL, user_id};
        next();
      }
    })
  }
};

const deletePayload = (req, res, next) => {
  const { id } = req.body;
  const user_id = req.user_id;
  if(!id || typeof id !== "number") res.status(400).json({message:"You must include a valid id"});
  else {
    plantsModel.getById(id).then(plant => {
      if(!plant) res.status(200).json({message:`plant of id ${id} already does not exist`})
      else if(plant.user_id !== user_id) res.status(401).json({message:"You may not delete this plant as it is not your plant"});
      else {
        req.payload = id;
        next();
      }
    })
  }
};

module.exports = {
  verifyUser,
  insertPayload,
  updatePayload,
  deletePayload
};