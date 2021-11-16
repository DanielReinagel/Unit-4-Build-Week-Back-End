const router = require("express").Router();
const model = require("./plants-model");
const { verifyUser, insertPayload, updatePayload, deletePayload } = require("./plants-middleware");

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

router.put("/", verifyUser, updatePayload, (req, res) => {
  model.update(req.payload)
    .then(plant => res.status(200).json(plant))
    .catch(err => res.status(500).json({message:err.message, stack:err.stack, where:"updating plant"}));
})

router.delete("/", verifyUser, deletePayload, (req, res) => {
  model.deleteById(req.payload)
    .then(() => res.status(200).json({message:`plant with id ${req.payload} was successfully deleted`}))
    .catch(err => res.status(500).json({message:err.message, stack:err.stack, where:"deleting plant"}));
})

module.exports = router;