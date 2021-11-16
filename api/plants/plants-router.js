const router = require("express").Router();
const model = require("./plants-model");
const { verifyUser } = require("./plants-middleware");

router.get("/", verifyUser, (req, res) => {
  model.getByUserId(req.user_id)
    .then(plants => res.status(200).json(plants))
    .catch(err => res.status(500).json({message:err.message, stack:err.stack, where:"getting plants"}));
});

module.exports = router;