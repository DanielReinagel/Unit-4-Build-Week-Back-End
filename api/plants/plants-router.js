const router = require("express").Router();
const model = require("./plants-model");
const { verifyUser, insertPayload } = require("./plants-middleware");

router.get("/", verifyUser, (req, res) => {
  model.getByUserId(req.user_id)
    .then(plants => res.status(200).json(plants))
    .catch(err => res.status(500).json({message:err.message, stack:err.stack, where:"getting plants"}));
});

router.post("/", verifyUser, insertPayload, (req, res) => {
  model.insert(req.payload)
    .then(plant => res.status(201).json(plant))
    .catch(err => res.status(500).json({message:err.message, stack:err.stack, where:"adding plant"}));
})

module.exports = router;