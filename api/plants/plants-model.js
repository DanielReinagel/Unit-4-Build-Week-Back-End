const db = require("../data/db-config");

const getByUserId = user_id => db("plants").where({ user_id });
const getById = id => db("plants").where({ id }).first();
const insert = plant => db("plants").insert(plant, ["*"]).then(plants => plants[0]);
const update = plant => db("plants").where({ id: plant.id }).update(plant).then(() => plant);
const deleteById = id => db("plants").where({ id }).del();

module.exports = {
  getByUserId,
  getById,
  insert,
  update,
  deleteById
};