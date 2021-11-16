exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.increments(),
    table.string("username").notNullable().unique(),
    table.string("phoneNumber").notNullable(),
    table.string("password").notNullable()
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};