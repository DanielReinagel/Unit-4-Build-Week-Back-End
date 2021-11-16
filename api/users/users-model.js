const db = require("../../data/db-config");

const getAll = () => db("users");
const getBy = filter => db("users").where(filter);
const getById = id => db("users").where({ id }).first();
const insert = user => db("users").insert(user, ['user_id', 'username', 'phoneNumber', 'password']).then(users => users[0]);
const update = user => db("users").where({ id: user.id }).update(user).then(() => user);

module.exports = {
  getAll,
  getBy,
  getById,
  insert,
  update
};