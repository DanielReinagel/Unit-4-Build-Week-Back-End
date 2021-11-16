exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.increments(),
    table.string("username").notNullable().unique(),
    table.string("phoneNumber").notNullable(),
    table.string("password").notNullable()
  }).createTable("plants", table => {
    table.increments(),
    table.string("nickname").notNullable(),
    table.string("species").notNullable(),
    table.string("h2oFrequency").notNullable(),
    table.string("imageURL"),
    table.integer("user_id").notNullable().unsigned().references("id").inTable("users").onUpdate('CASCADE').onDelete('RESTRICT')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users").dropTableIfExists("plants");
};